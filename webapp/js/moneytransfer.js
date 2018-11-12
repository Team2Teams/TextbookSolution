function transferMoney(){
return 15;
} 

function handleTransferMoney(){
    alert('In handleTransferMoney');
    var transferUser = document.getElementById('transferMoneyAccount').value;
    var recipientUser = document.getElementById('receiverMoneyAccount').value;
    var sum = document.getElementById('transferMoneySum').value;

    alert('transferUser = ' + transferUser + '    recipientUser = ' + recipientUser + '     sum = ' + sum);
}