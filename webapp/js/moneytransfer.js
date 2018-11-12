function transferMoney(){
return 15;
} 

function handleTransferMoney(){
    alert('In handleTransferMoney');
    var transferUser = document.getElementById('transferMoneyAccount').value;
    var recipientUser = document.getElementById('receiverMoneyAccount').value;
    var sum = document.getElementById('transferMoneySum').value;

    alert('transferUser = ' + transferUser + '    recipientUser = ' + recipientUser + '     sum = ' + sum);
    transferMoney(transferUser, recipientUser, sum );
}


function transferMoney(transferUser, recipientUser, sum ) {
    console.log("getting balance with token " + authToken);
    $.ajax({
        method: 'POST',
        url: _config.api.invokeUrl + "/moneyTransfer",
        headers: {
            Authorization: authToken
        },
        contentType: 'application/json',
        success: successMoneyTransfer,
        error: function ajaxError(jqXHR, textStatus, errorThrown) {
        console.error('Error requesting balance: ', textStatus, ', Details: ', errorThrown);
        console.error('Response: ', jqXHR.responseText);
        alert('error money transfer ' + jqXHR.responseText);
        }
    });
}



function successMoneyTransfer(result) {
    alert("Success");
}
