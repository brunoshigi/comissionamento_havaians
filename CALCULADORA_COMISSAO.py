# commission_gui.py
# Calculadora de comissão Havaianas (percentual) – Tkinter

import tkinter as tk
from tkinter import ttk, messagebox

# ---------- Regras fixas ----------
FAIXAS_VENDAS = [
    ("Até 50 %",        0.0,  0.5, 0.000),   # 0 %
    ("50 % – 80 %",     0.5,  0.8, 0.008),   # 0,8 %
    ("80 % – 90 %",     0.8,  0.9, 0.011),   # 1,1 %
    ("90 % – 100 %",    0.9,  1.0, 0.014),   # 1,4 %
    ("Acima de 100 %",  1.0,  float("inf"), 0.018),  # 1,8 %
]

PA_FAIXAS = [
    ("< 1,70",        0.0000),
    ("1,70 – 1,79",   0.0005),
    ("1,80 – 2,09",   0.0010),
    ("2,10 – 2,19",   0.0020),
    ("≥ 2,20",        0.0050),
]

# ---------- Função de cálculo ----------
def calcular():
    try:
        meta_val = float(entry_meta.get().replace(",", "."))
    except ValueError:
        messagebox.showerror("Erro", "Digite a meta em formato numérico (ex.: 40000 ou 40.000,00).")
        return

    # Limpa tabelas
    tree_vendas.delete(*tree_vendas.get_children())
    tree_pa.delete(*tree_pa.get_children())

    # --- Tabela 1: Comissão sobre vendas ---
    for rotulo, ini, fim, pct in FAIXAS_VENDAS:
        min_venda = ini * meta_val
        max_venda = None if fim == float("inf") else fim * meta_val

        faixa_txt = (
            f"≥ R$ {min_venda:,.2f}"
            if max_venda is None
            else f"R$ {min_venda:,.2f} – R$ {max_venda:,.2f}"
        )

        com_min = min_venda * pct
        com_max = None if max_venda is None else max_venda * pct
        ganho_txt = (
            f"≥ R$ {com_min:,.2f}"
            if com_max is None
            else f"R$ {com_min:,.2f} – R$ {com_max:,.2f}"
        )

        tree_vendas.insert("", "end", values=(faixa_txt, f"{pct*100:.2f} %", ganho_txt))

    # --- Tabela 2: Comissão extra por PA ---
    for pa_rotulo, pa_pct in PA_FAIXAS:
        extra_meta = meta_val * pa_pct           # ganho se vender exatamente a meta
        formula = f"Venda × {pa_pct*100:.2f} %"
        ganho_meta = f"R$ {extra_meta:,.2f}"
        tree_pa.insert("", "end", values=(pa_rotulo, formula, ganho_meta))

# ---------- Interface ----------
root = tk.Tk()
root.title("Calculadora de Comissões Havaianas 🩴")
root.resizable(False, False)

frm_inputs = ttk.Frame(root, padding=10)
frm_inputs.pack(fill="x")

ttk.Label(frm_inputs, text="Meta mensal (R$):").grid(row=0, column=0, sticky="w")
entry_meta = ttk.Entry(frm_inputs, width=15)
entry_meta.insert(0, "40000")
entry_meta.grid(row=0, column=1, padx=5, pady=2)

btn_calc = ttk.Button(frm_inputs, text="Calcular", command=calcular)
btn_calc.grid(row=0, column=2, padx=10)

# Frames das tabelas
frm_tables = ttk.Frame(root, padding=(10, 0, 10, 10))
frm_tables.pack()

# --- Tabela Comissão sobre Vendas ---
lbl1 = ttk.Label(frm_tables, text="1) Comissão sobre Vendas", font=("Segoe UI", 10, "bold"))
lbl1.grid(row=0, column=0, sticky="w")

cols1 = ("Faixa de Vendas", "% Comissão", "Quanto se Ganha")
tree_vendas = ttk.Treeview(frm_tables, columns=cols1, show="headings", height=5)
for col in cols1:
    tree_vendas.heading(col, text=col)
    tree_vendas.column(col, anchor="center", width=170, stretch=True)
tree_vendas.grid(row=1, column=0, padx=5, pady=5)

# --- Tabela Comissão extra por PA ---
lbl2 = ttk.Label(frm_tables, text="2) Comissão Extra por PA (ganho se vender 100 % da meta)", font=("Segoe UI", 10, "bold"))
lbl2.grid(row=0, column=1, sticky="w")

cols2 = ("PA Médio", "Fórmula", f"Ganho c/ meta")
tree_pa = ttk.Treeview(frm_tables, columns=cols2, show="headings", height=5)
for col in cols2:
    tree_pa.heading(col, text=col)
    tree_pa.column(col, anchor="center", width=170, stretch=True)
tree_pa.grid(row=1, column=1, padx=5, pady=5)

root.mainloop()
