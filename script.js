document.addEventListener('DOMContentLoaded', function() {
    // Actualizar el año en el footer
    document.getElementById('current-year').textContent = new Date().getFullYear();
    
    // Elementos del DOM
    const calculateBtn = document.getElementById('calculate-btn');
    const resetBtn = document.getElementById('reset-btn');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const autoBtn = document.getElementById('auto-btn');
    const arrayInput = document.getElementById('array-input');
    const targetInput = document.getElementById('target-input');
    const resultMessage = document.getElementById('result-message');
    const arrayDisplay = document.getElementById('array-display');
    const stepsUl = document.getElementById('steps');
    const leftPointer = document.getElementById('left-pointer');
    const rightPointer = document.getElementById('right-pointer');
    const exampleBtns = document.querySelectorAll('.example-pill');
    
    // Variables para la animación
    let animationSteps = [];
    let currentStep = -1;
    let autoPlayInterval = null;
    let numbers = [];
    
    // Eventos para los botones de ejemplo
    exampleBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            arrayInput.value = this.getAttribute('data-array');
            targetInput.value = this.getAttribute('data-target');
        });
    });
    
    // Evento para calcular
    calculateBtn.addEventListener('click', function() {
        startVisualization();
    });
    
    // Evento para reiniciar
    resetBtn.addEventListener('click', function() {
        resetVisualization();
    });
    
    // Evento para el paso anterior
    prevBtn.addEventListener('click', function() {
        showPrevStep();
    });
    
    // Evento para el siguiente paso
    nextBtn.addEventListener('click', function() {
        showNextStep();
    });
    
    // Evento para reproducción automática
    autoBtn.addEventListener('click', function() {
        if (autoPlayInterval) {
            clearInterval(autoPlayInterval);
            autoPlayInterval = null;
            autoBtn.innerHTML = '<span class="button-icon">▶️</span><span>Auto</span>';
        } else {
            autoBtn.innerHTML = '<span class="button-icon">⏹</span><span>Detener</span>';
            autoPlayInterval = setInterval(showNextStep, 1000);
        }
    });
    
    // Función para iniciar la visualización
    function startVisualization() {
        // Detener animación anterior si existe
        if (autoPlayInterval) {
            clearInterval(autoPlayInterval);
            autoPlayInterval = null;
            autoBtn.innerHTML = '<span class="button-icon">▶️</span><span>Auto</span>';
        }
        
        // Obtener y validar inputs
        const inputArray = arrayInput.value.split(',').map(item => parseInt(item.trim()));
        const target = parseInt(targetInput.value);
        
        if (inputArray.some(isNaN) || isNaN(target)) {
            resultMessage.innerHTML = 'Por favor, ingresa valores numéricos válidos.';
            resultMessage.style.color = 'var(--primary)';
            return;
        }
        
        // Validar que el array esté ordenado
        for (let i = 1; i < inputArray.length; i++) {
            if (inputArray[i] < inputArray[i-1]) {
                resultMessage.innerHTML = 'El array debe estar ordenado en forma ascendente.';
                resultMessage.style.color = 'var(--primary)';
                return;
            }
        }
        
        // Reiniciar visualización
        resetVisualization();
        
        // Guardar numbers para referencia
        numbers = inputArray;
        
        // Mostrar array
        inputArray.forEach((num, index) => {
            const itemDiv = document.createElement('div');
            itemDiv.className = 'array-item';
            itemDiv.id = `item-${index}`;
            itemDiv.textContent = num;
            itemDiv.setAttribute('data-index', index + 1); // Base 1 indexing
            arrayDisplay.appendChild(itemDiv);
        });
        
        // Generar pasos de animación
        generateAnimationSteps(inputArray, target);
        
        // Activar controles
        nextBtn.disabled = false;
        prevBtn.disabled = true;
        autoBtn.disabled = false;
        resultMessage.textContent = 'Visualización lista. Presiona "Siguiente" para avanzar paso a paso.';
        resultMessage.style.color = 'var(--tertiary)';
    }
    
    // Función Two Sum II con dos punteros que devuelve la solución y registra los pasos
    function twoSumII(numbers, target) {
        const steps = [];
        
        // Paso inicial
        steps.push({
            type: 'init',
            message: `Inicializando algoritmo con array ordenado [${numbers.join(', ')}] y target ${target}`,
            left: 0,
            right: numbers.length - 1,
            phase: 'init'
        });
        
        // Inicializamos los punteros izquierdo y derecho
        let left = 0;
        let right = numbers.length - 1;
        
        // Iteramos mientras los punteros no se crucen
        while (left < right) {
            const currentSum = numbers[left] + numbers[right];
            
            // Paso: evaluando la suma actual
            steps.push({
                type: 'calc',
                message: `Calculando: numbers[${left}] (${numbers[left]}) + numbers[${right}] (${numbers[right]}) = ${currentSum}`,
                left: left,
                right: right,
                phase: 'calc'
            });
            
            // Si la suma es igual al target, hemos encontrado la solución
            if (currentSum === target) {
                // Paso: encontró solución
                steps.push({
                    type: 'found',
                    message: `¡Solución encontrada! numbers[${left}] (${numbers[left]}) + numbers[${right}] (${numbers[right]}) = ${target}`,
                    left: left,
                    right: right,
                    solution: [left + 1, right + 1], // Base 1 indexing
                    phase: 'solution'
                });
                
                return {
                    solution: [left + 1, right + 1], // Base 1 indexing
                    steps: steps
                };
            }
            
            // Si la suma es menor que el target, incrementamos el puntero izquierdo
            else if (currentSum < target) {
                steps.push({
                    type: 'move',
                    message: `${currentSum} < ${target}, movemos puntero izquierdo de ${left} a ${left + 1}`,
                    left: left,
                    right: right,
                    move: 'left',
                    phase: 'move'
                });
                
                left++;
            }
            
            // Si la suma es mayor que el target, decrementamos el puntero derecho
            else {
                steps.push({
                    type: 'move',
                    message: `${currentSum} > ${target}, movemos puntero derecho de ${right} a ${right - 1}`,
                    left: left,
                    right: right,
                    move: 'right',
                    phase: 'move'
                });
                
                right--;
            }
        }
        
        // No se encontró solución
        steps.push({
            type: 'notfound',
            message: 'No se encontró una solución válida.',
            left: left,
            right: right,
            phase: 'end'
        });
        
        return {
            solution: [],
            steps: steps
        };
    }
    
    // Generar pasos de animación
    function generateAnimationSteps(nums, target) {
        // Ejecutar el algoritmo Two Sum II
        const result = twoSumII(nums, target);
        
        // Guardar los pasos para la animación
        animationSteps = result.steps;
    }
    
    // Mostrar paso anterior
    function showPrevStep() {
        if (currentStep > 0) {
            // Reducir el paso actual
            currentStep--;
            
            // Actualizar controles
            nextBtn.disabled = false;
            autoBtn.disabled = false;
            if (currentStep === 0) {
                prevBtn.disabled = true;
            }
            
            // Mostrar el paso actual
            updateVisualization();
        }
    }
    
    // Mostrar siguiente paso
    function showNextStep() {
        if (currentStep < animationSteps.length - 1) {
            // Incrementar el paso actual
            currentStep++;
            
            // Actualizar controles
            prevBtn.disabled = false;
            if (currentStep === animationSteps.length - 1) {
                nextBtn.disabled = true;
                if (autoPlayInterval) {
                    clearInterval(autoPlayInterval);
                    autoPlayInterval = null;
                    autoBtn.innerHTML = '<span class="button-icon">▶️</span><span>Auto</span>';
                }
                autoBtn.disabled = true;
            }
            
            // Mostrar el paso actual
            updateVisualization();
        }
    }
    
    // Actualizar visualización según el paso actual
    function updateVisualization() {
        const step = animationSteps[currentStep];
        
        // Resetear todos los elementos
        document.querySelectorAll('.array-item').forEach(item => {
            item.classList.remove('selected', 'processed', 'active-left', 'active-right');
        });
        
        // Posicionar punteros
        if (step.left !== undefined && step.right !== undefined) {
            updatePointers(step.left, step.right);
        }
        
        // Destacar elementos activos
        const leftItem = document.getElementById(`item-${step.left}`);
        const rightItem = document.getElementById(`item-${step.right}`);
        
        if (leftItem) leftItem.classList.add('active-left');
        if (rightItem) rightItem.classList.add('active-right');
        
        // Destacar solución si se encontró
        if (step.solution) {
            step.solution.forEach(idx => {
                const adjustedIdx = idx - 1; // Adjust for 1-indexing in solution
                const item = document.getElementById(`item-${adjustedIdx}`);
                if (item) item.classList.add('selected');
            });
        }
        
        // Añadir paso al historial si es nuevo
        if (stepsUl.childElementCount <= currentStep + 1) { // +1 for the placeholder
            const li = document.createElement('li');
            li.textContent = step.message;
            
            // Estilo según el tipo de paso
            if (step.type === 'found') {
                li.classList.add('solution');
            } else if (step.type === 'calc') {
                li.classList.add('highlight');
            }
            
            // Eliminar placeholder si es el primer paso real
            if (stepsUl.querySelector('.placeholder-step') && stepsUl.childElementCount === 1) {
                stepsUl.innerHTML = '';
            }
            
            stepsUl.appendChild(li);
            li.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
        
        // Actualizar mensaje de resultado para la solución final
        if (step.type === 'found') {
            resultMessage.innerHTML = `¡Solución encontrada! <strong>[${step.solution.join(', ')}]</strong>`;
        } else if (step.type === 'notfound') {
            resultMessage.textContent = 'No se encontró una solución válida.';
        } else {
            resultMessage.textContent = step.phase === 'init' ? 
                'Inicializando algoritmo Two Pointers...' : 
                'Buscando dos números que sumen el target...';
        }
    }
    
    // Actualizar posición de los punteros
    function updatePointers(leftIdx, rightIdx) {
        leftPointer.classList.add('visible');
        rightPointer.classList.add('visible');
        
        const leftItem = document.getElementById(`item-${leftIdx}`);
        const rightItem = document.getElementById(`item-${rightIdx}`);
        
        if (leftItem && rightItem) {
            const leftRect = leftItem.getBoundingClientRect();
            const rightRect = rightItem.getBoundingClientRect();
            const containerRect = arrayDisplay.getBoundingClientRect();
            
            // Calcular posición relativa al contenedor
            const leftPos = leftRect.left - containerRect.left + leftRect.width / 2;
            const rightPos = rightRect.left - containerRect.left + rightRect.width / 2;
            
            leftPointer.style.left = `${leftPos}px`;
            rightPointer.style.left = `${rightPos}px`;
        }
    }
    
    // Reiniciar visualización
    function resetVisualization() {
        stepsUl.innerHTML = '<li class="placeholder-step">La visualización mostrará los pasos del algoritmo aquí.</li>';
        arrayDisplay.innerHTML = '';
        resultMessage.textContent = 'Presiona "Iniciar búsqueda" para comenzar la visualización';
        resultMessage.style.color = 'var(--tertiary)';
        
        leftPointer.classList.remove('visible');
        rightPointer.classList.remove('visible');
        
        currentStep = -1;
        animationSteps = [];
        numbers = [];
        
        nextBtn.disabled = true;
        prevBtn.disabled = true;
        autoBtn.disabled = true;
        autoBtn.innerHTML = '<span class="button-icon">▶️</span><span>Auto</span>';
        
        if (autoPlayInterval) {
            clearInterval(autoPlayInterval);
            autoPlayInterval = null;
        }
    }
});