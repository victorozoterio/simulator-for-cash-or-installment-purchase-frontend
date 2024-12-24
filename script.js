document.getElementById('simulator-form').addEventListener('submit', (event) => {
    event.preventDefault();

    const cashValue = Number.parseInt(document.getElementById('cash-value').value) || 0;
    const installmentValue = Number.parseInt(document.getElementById('installment-value').value) || 0;
    const numberOfInstallments = Number.parseInt(document.getElementById('number-of-installments').value) || 0;
        
    const data = {
        cashValue: cashValue,
        installmentValue: installmentValue,
        numberOfInstallments: numberOfInstallments
    };

    fetch('https://apiavistaouparcelado.vercel.app/calculator', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(result => {
        const translatedResult = result.result === "It is better to pay in installments" 
        ? "É melhor pagar parcelado!" 
        : result.result === "It is better to pay in cash"
        ? "É melhor pagar à vista!" 
        : result.result;

        const translatedCashOption = result.cashOption.replace(
        "Paying in cash will save you",
        "Pagando em dinheiro você economizará"
        );

        const translatedInstallmentOption = result.installmentOption.replace(
        "Paying in installments will save you",
        "Pagando parcelado você economizará"
        );

        const translatedNote = result.note.replace(
            /It was taken into account a Selic rate of (.+?), an income tax rate of (.+?), and a simulation of an investment of (.+?) in a daily liquidity CDB \(100% of CDI\), where (.+?) is withdrawn every month on the invoice closing date\./,
            "Observação: Foi considerada uma taxa Selic de $1, uma alíquota de imposto de renda de $2 e simulado uma aplicação de $3 em um CDB de liquidez diária (100% do CDI), onde $4 são sacados todo mês na data de fechamento da fatura."
        );
    
        const resultContainer = document.getElementById('result-container');
        resultContainer.style.display = 'block';
        resultContainer.textContent = translatedResult;

        const cashOptionContainer = document.getElementById('cash-option-container');
        cashOptionContainer.style.display = 'block';
        cashOptionContainer.textContent = translatedCashOption;

        const cashInstallmentContainer = document.getElementById('installment-option-container');
        cashInstallmentContainer.style.display = 'block';
        cashInstallmentContainer.textContent = translatedInstallmentOption;

        const noteContainer = document.getElementById('note-container');
        noteContainer.style.display = 'block';
        noteContainer.textContent = translatedNote;
    })
    .catch(error => {
        const resultContainer = document.getElementById('result-container');
        resultContainer.style.display = 'grid';
        resultContainer.innerHTML = `<strong>Erro ao enviar os dados:</strong> ${error.message}`;
    });
});
