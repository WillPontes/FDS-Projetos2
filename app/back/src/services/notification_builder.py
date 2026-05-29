from typing import Any

def build_message(result: dict[str, Any]) -> str:
    """
    Constrói uma mensagem personalizada com base nos resultados da transação.
    """
    environmental = result.get("environmental", {})
    water_liters = environmental.get("water_liters", 0.0)
    
    if water_liters > 0:
        return f"Você salvou {water_liters:.2f} litros de água agora!"
    
    # Se não houver economia de água, verifica se há de papel
    paper_tickets = environmental.get("paper_tickets", 0.0)
    if paper_tickets > 0:
        return f"Você economizou papel hoje!"
        
    return "Transação processada com sucesso!"
