import pypdf

reader = pypdf.PdfReader('fontes_tormenta/o-mundo-de-arton-o-panteao-taverna-do-elfo-e-do-arcaniospdf.pdf')
for p in range(9, 17):
    print(f"\n==================== PÁGINA {p+1} ====================")
    print(reader.pages[p].extract_text() or '')

