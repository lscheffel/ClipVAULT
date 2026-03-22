import webview
import threading
import time
import os
import json
import sqlite3
from pystray import Icon, MenuItem, Menu
from PIL import Image
import tempfile
import pyperclip
import tkinter as tk
from tkinter import filedialog

# Caminhos
BASE_DIR = os.path.abspath(os.path.dirname(__file__))
UI_PATH = os.path.join(BASE_DIR, 'ui', 'index.html')
DB_PATH = os.path.join(BASE_DIR, 'clipboard.db')
ICON_PATH = os.path.join(BASE_DIR, 'icon.png')  # opcional

# Estado global
window = None          # objeto webview.Window ou None
tray_icon = None       # objeto pystray.Icon
last_clipboard = ""
_shutdown = False      # sinal para sair do app (usado pelo tray -> exit)

# ---------- Banco ----------
def init_db():
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute('''
        CREATE TABLE IF NOT EXISTS clipboard (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            content TEXT,
            type TEXT,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    conn.commit()
    conn.close()

def add_clipboard_item(content, ctype="text"):
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute('INSERT INTO clipboard (content, type) VALUES (?, ?)', (content, ctype))
    conn.commit()
    conn.close()

def get_history_rows(limit=200):
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute('SELECT id, content, type, timestamp FROM clipboard ORDER BY id DESC LIMIT ?', (limit,))
    rows = c.fetchall()
    conn.close()
    return rows

def export_data():
    rows = get_history_rows(limit=10000)
    export_path = os.path.join(BASE_DIR, 'clipboard_export.json')
    with open(export_path, 'w', encoding='utf-8') as f:
        json.dump([{'id': r[0], 'content': r[1], 'type': r[2], 'timestamp': r[3]} for r in rows], f, indent=4, ensure_ascii=False)
    print(f'[ClipVault] Dados exportados para {export_path}')
    return export_path

# ---------- Monitor do clipboard ----------
def clipboard_monitor():
    global last_clipboard, _shutdown
    while not _shutdown:
        try:
            text = pyperclip.paste()
            if text and text != last_clipboard:
                last_clipboard = text
                add_clipboard_item(text, "text")
        except Exception:
            pass
        time.sleep(1)

# ---------- API JS <-> Python ----------
class Api:
    def get_history(self):
        rows = get_history_rows(limit=500)
        return [
            {"id": r[0], "content": r[1], "type": r[2], "timestamp": r[3]}
            for r in rows
        ]

    def copy_item(self, content_or_id):
        try:
            if isinstance(content_or_id, int) or (isinstance(content_or_id, str) and content_or_id.isdigit()):
                cid = int(content_or_id)
                conn = sqlite3.connect(DB_PATH)
                c = conn.cursor()
                c.execute('SELECT content FROM clipboard WHERE id=?', (cid,))
                row = c.fetchone()
                conn.close()
                if row:
                    pyperclip.copy(row[0])
                    return True
                return False
            else:
                pyperclip.copy(content_or_id)
                return True
        except Exception as e:
            print("[ClipVault] Erro copy_item:", e)
            return False

    def delete_item(self, id_):
        try:
            cid = int(id_)
            conn = sqlite3.connect(DB_PATH)
            c = conn.cursor()
            c.execute('DELETE FROM clipboard WHERE id=?', (cid,))
            conn.commit()
            conn.close()
            return True
        except Exception as e:
            print("[ClipVault] Erro delete_item:", e)
            return False

    def save_item(self, id_):
        try:
            cid = int(id_)
            conn = sqlite3.connect(DB_PATH)
            c = conn.cursor()
            c.execute('SELECT content, type FROM clipboard WHERE id=?', (cid,))
            row = c.fetchone()
            conn.close()
            if not row:
                return ""
            content, ctype = row

            root = tk.Tk()
            root.withdraw()
            default_name = f"clipboard-{cid}.txt" if ctype == "text" else f"clipboard-{cid}"
            path = filedialog.asksaveasfilename(title="Salvar como", initialfile=default_name)
            root.destroy()

            if not path:
                return ""

            if ctype == "text":
                with open(path, "w", encoding="utf-8") as f:
                    f.write(content)
            else:
                with open(path, "wb") as f:
                    if isinstance(content, str):
                        f.write(content.encode("utf-8"))
                    else:
                        f.write(content)
            return path
        except Exception as e:
            print("[ClipVault] Erro save_item:", e)
            return ""

# ---------- Janela / Tray (com reinicialização do loop webview) ----------
def create_window_instance(js_api):
    """Cria a janela webview. Se já existir, não recria."""
    global window
    if window:
        return window

    window = webview.create_window(
        'ClipVault - Histórico da Área de Transferência',
        UI_PATH,
        width=900,
        height=650,
        hidden=True,            # inicia oculta
        resizable=True,
        js_api=js_api
    )

    # tenta anexar handler para fechar => esconder
    try:
        def on_closing(ev):
            # sempre esconder a janela ao invés de fechar
            try:
                window.hide()
            except Exception:
                pass
            return False

        if hasattr(window, 'events') and hasattr(window.events, 'closing'):
            window.events.closing += on_closing
    except Exception as e:
        print("[ClipVault] Aviso: não foi possível anexar handler de fechamento:", e)

    return window

def _start_webview_loop(js_api):
    """
    Loop que inicia o webview e, caso o loop termine (todas janelas fechadas),
    reinicia o webview se o app não estiver em processo de shutdown.
    IMPORTANTE: esta função deve ser executada no MAIN THREAD em Windows.
    """
    global window, _shutdown
    while not _shutdown:
        # Se não existe janela, cria oculta
        if not window:
            create_window_instance(js_api)
        try:
            # Start bloqueante do webview. Quando retornar, significa que o loop terminou
            webview.start(gui='edgechromium', debug=False)
        except Exception as e:
            # Em alguns casos, start pode lançar; aguardamos e tentamos recriar
            print("[ClipVault] webview.start encerrou com exceção:", e)

        # Ao chegar aqui, o webview loop encerrou (por fechamento da janela ou erro).
        # Queremos manter o processo vivo enquanto o tray existir, então:
        if _shutdown:
            break

        # Damos um pequeno delay e recriamos a janela oculta; o loop recomeçará na próxima iteração
        try:
            window = None
            time.sleep(0.4)
            # criar novamente para a próxima iteração
            # note: create_window_instance será chamado no topo do loop
        except Exception as e:
            print("[ClipVault] Erro ao reiniciar webview loop:", e)
            time.sleep(1)

def setup_tray(js_api):
    """
    Cria o ícone de bandeja em thread separada. 
    on_show tenta mostrar a janela; se o webview loop não estiver rodando, a função
    _start_webview_loop (rodando no main thread) irá recriar a janela automaticamente.
    """
    def on_show(icon, item=None):
        # Se window existir, apenas mostra
        try:
            if window:
                window.show()
            else:
                # se a janela não existir porque webview loop caiu, apenas criar a janela nuvem
                # a função _start_webview_loop (rodando no main thread) irá recriar o loop/janela se necessário
                # para forçar a recriação, podemos tentar criar instância aqui (não fatal se falhar)
                try:
                    create_window_instance(js_api)
                except Exception:
                    pass
        except Exception as e:
            print("[ClipVault] Erro on_show:", e)

    def on_export(icon, item=None):
        export_data()

    def on_exit(icon, item=None):
        global _shutdown
        _shutdown = True
        try:
            icon.visible = False
            icon.stop()
        except Exception:
            pass
        # Se existir janela, fechar/destroy para permitir webview.start retornar
        try:
            if window:
                # window.destroy might not be available on all backends; hide first
                window.hide()
        except Exception:
            pass
        # força saída do processo
        os._exit(0)

    def on_double_click(icon, item=None):
        on_show(icon, item)

    # prepara imagem
    if not os.path.exists(ICON_PATH):
        tmp = os.path.join(tempfile.gettempdir(), 'clipvault_icon.png')
        Image.new('RGBA', (64, 64), color=(40, 120, 200, 255)).save(tmp)
        icon_img = Image.open(tmp)
    else:
        icon_img = Image.open(ICON_PATH)

    menu = Menu(
        MenuItem('Mostrar', on_show),
        MenuItem('Exportar', on_export),
        MenuItem('Sair', on_exit)
    )

    icon = Icon("ClipVault", icon_img, "ClipVault", menu)

    # tenta mapear duplo clique (nem todos os backends suportam)
    try:
        icon.on_double_click = on_double_click
    except Exception:
        pass

    # roda o tray icon em thread separada (bloqueante dentro da thread)
    def run_icon():
        try:
            icon.run()
        except Exception as e:
            print("[ClipVault] pystray icon.run() terminou:", e)

    t = threading.Thread(target=run_icon, daemon=True)
    t.start()
    return icon

# ---------- Main ----------
if __name__ == '__main__':
    init_db()

    # Inicia monitor do clipboard (thread daemon)
    t_clip = threading.Thread(target=clipboard_monitor, daemon=True)
    t_clip.start()

    # Cria API
    api = Api()

    # Cria a janela (oculta) antes de iniciar o loop
    create_window_instance(js_api=api)

    # Inicia tray (thread separada)
    tray_icon = setup_tray(js_api=api)

    # Nota IMPORTANT: webview.start must run on main thread (Windows).
    # Aqui rodamos o loop que reinicia automaticamente caso a janela seja fechada.
    try:
        _start_webview_loop(js_api=api)
    except KeyboardInterrupt:
        _shutdown = True
        print("[ClipVault] encerrando por KeyboardInterrupt")
        os._exit(0)
