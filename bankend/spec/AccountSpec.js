const Account = require('../account');

describe("Account", function() {
    beforeAll(async function() {
        await Account.ensure_account_exists("TEST2-at-kashyoo.com");
    });

    it("return null when username does not exist", async function() {
        var balance = await Account.get_balance_for_user("nonexist");
	expect (balance).toEqual(null);
    });

    it("return 7000 for test user", async function() {
        var balance = await Account.get_balance_for_user("TEST2-at-kashyoo.com");
	expect (balance).toEqual(7000);
    });

    // it("Check transfer money", async function() {
    //     var balance = await Account.moneyTransfer("dudushr-at-yahoo.com", "uri.pasternak-at-gmail.com", 100);
    // expect (balance).toEqual(1);
    // });
   


    it("Check user exist", async function() {
        var user = await Account.getUserData("dudushr-at-yahoo.com");
        //var user = true;
    expect (user.records.length).toEqual(1);
    });

    xit("Check balnce ", async function() {
        var user = await Account.getUserData("dudushr-at-yahoo.com");
        var balance = await Account.getUserBalance(user);
    expect (balance).toEqual(5000);
    });

    it("Check update balance ", async function() {
        
        await Account.updateUserBalance("dudushr-at-yahoo.com", 7000);
        var user = await Account.getUserData("dudushr-at-yahoo.com");
        balance = await Account.getUserBalance(user);
    expect (balance).toEqual(7000);
    });


    it("Final Test ", async function() {
        
        await Account.moneyTransfer("dudushr-at-yahoo.com", "uri.pasternak-at-gmail.com", 100);
        var user = await Account.getUserData("dudushr-at-yahoo.com");
        balance = await Account.getUserBalance(user);
    expect (balance).toEqual(6900);
    });

});