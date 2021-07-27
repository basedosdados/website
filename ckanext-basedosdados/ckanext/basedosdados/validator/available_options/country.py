from .attr_enum import AttrEnum

class CountryEnum(AttrEnum):
    
    # country codes from ISO 3166
    # https://www.iban.com/country-codes
    
    bra = {"label": "Brasil"}
    arg = {"label": "Argentina"}
    bol = {"label": "Bolívia"}
    chl = {"label": "Chile"}
    col = {"label": "Colômbia"}

    can = {"label": "Canadá"}
    usa = {"label": "Estados Unidos da América"}
    mex = {"label": "México"}
    
    deu = {"label": "Alemanha"}
    esp = {"label": "Espanha"}
    fra = {"label": "França"}
    ita = {"label": "Itália"}
    prt = {"label": "Portugal"}

    chn = {"label": "China"}
    ind = {"label": "Índia"}
    tha = {"label": "Tailândia"}