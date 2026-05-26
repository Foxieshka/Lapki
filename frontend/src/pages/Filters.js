// Вернуть список активированных чекбоксов
function getArrayOfValues(form){
    let formElements = Array.from(form.elements);
    const result = [];
    formElements.forEach(function(item){
        if(item.checked){
            result.push(item.value);
        }
    });
    return result;
}
