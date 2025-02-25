"""
Two Sum II - Input Array is Sorted
Complejidad Temporal: O(n)
Complejidad Espacial: O(1)

Autor: Elizabeth Diaz Familia
"""

def twoSum(numbers, target):
    """
    Encuentra los índices (base 1) de dos números en un array ordenado que suman el valor objetivo.
    
    Args:
        numbers: List[int] - Array ordenado de números enteros
        target: int - Valor objetivo que deben sumar los dos números
        
    Returns:
        List[int] - Índices (base 1) de los dos números que suman el valor objetivo
    """
    # Inicializamos los punteros izquierdo y derecho
    left, right = 0, len(numbers) - 1
    
    # Iteramos mientras los punteros no se crucen
    while left < right:
        current_sum = numbers[left] + numbers[right]
        
        # Si la suma es igual al target, hemos encontrado la solución
        if current_sum == target:
            # Devolvemos los índices en base 1 (sumando 1 a cada índice)
            return [left + 1, right + 1]
        
        # Si la suma es menor que el target, incrementamos el puntero izquierdo
        elif current_sum < target:
            left += 1
        
        # Si la suma es mayor que el target, decrementamos el puntero derecho
        else:  # current_sum > target
            right -= 1
    
    # En caso de que no haya solución (aunque el problema garantiza que hay una)
    return []


# Ejemplos de prueba
if __name__ == "__main__":
    # Ejemplo 1: numbers = [2,7,11,15], target = 9 -> [1,2]
    print(f"Ejemplo 1: {twoSum([2, 7, 11, 15], 9)}")
    
    # Ejemplo 2: numbers = [2,3,4], target = 6 -> [1,3]
    print(f"Ejemplo 2: {twoSum([2, 3, 4], 6)}")
    
    # Ejemplo 3: numbers = [-1,0], target = -1 -> [1,2]
    print(f"Ejemplo 3: {twoSum([-1, 0], -1)}")