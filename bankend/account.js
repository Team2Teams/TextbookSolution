var neo4j = require('neo4j-driver').v1;

const neo4jUser = process.env.NEO4J_USER;
const neo4jPassword = process.env.NEO4J_PASSWORD;
const neo4jEndpoint = process.env.NEO4J_ENDPOINT;

const INITIAL_BALANCE = 7000;

function getNeo4jDriver()
{
        console.log("Connecting to neo4j");
        var driver = neo4j.driver(neo4jEndpoint, neo4j.auth.basic(neo4jUser, neo4jPassword));
        console.log("Created neo4j driver.");
        return driver;
}

/********************************************************************** */
// returns true/false whether account exists
/********************************************************************** */
async function userExists(session, username)
{
    const result = await session.run("Match (n:User) WHERE n.name='"+username+"' RETURN n.name");
    var isExists = (result.records.length >= 1);

    console.log("userExists for " + username + " result:" + isExists);
    return isExists; // true for success
}

/********************************************************************** */
// new user - new neo4j node
/********************************************************************** */
async function createUser(session, username)
{
    const result = await session.run("CREATE (n:User {name:'"+username+"', balance: "+INITIAL_BALANCE+" }) RETURN n");

    return result;
}

module.exports.get_balance_for_user = async (username) => {
    var driver = getNeo4jDriver();
    const session = driver.session();
    const result = await session.run("Match (n:User) WHERE n.name='"+username+"' RETURN n");
    session.close();
    driver.close();

    if (result.records.length == 0) {
        return null;
    }

    record = result.records[0];
    // get value and transform from neo4j-style-numbers
    var curBalance = record._fields[0].properties.balance;
    if ('low' in curBalance) { // if Neo4j long object, take only number.
        curBalance = curBalance.low;
    }
    console.log("getBalance result:" + curBalance);
    return Number(curBalance);
}

module.exports.ensure_account_exists = async (username) => {
    var driver = getNeo4jDriver();
    const session = driver.session();
    var result = null;
    if (!await userExists(session, username)) {
        result = await createUser(session, username);
    }
    else
    {
        result = "OK"; // not null - OK - successful.
    }

    session.close();
    driver.close();

    return result;
}


module.exports.moneyTransfer = async (username,recepientUserName,amount) => {
    var driver = getNeo4jDriver();
    const session = driver.session();
    const usernameResult = await session.run("Match (n:User) WHERE n.name='"+username+"' RETURN n");
    console.log("usernameResult :" + usernameResult);
    const recepientUserNameResult = await session.run("Match (n:User) WHERE n.name='"+recepientUserName+"' RETURN n");
    console.log("recepientUserNameResult :" + recepientUserNameResult);
    session.close();
    driver.close();

    if (result.records.length == 0) {
        return null;
    }

    usernameRecord = usernameResult.records[0];
    console.log("usernameRecord :" + usernameRecord);
    recepientUserNameRecord = recepientUserNameResult.records[0];
    console.log("recepientUserNameRecord :" + recepientUserNameRecord);
    // get value and transform from neo4j-style-numbers
    var userNameBalance = usernameRecord._fields[0].properties.balance;
    onsole.log("userNameBalance :" + userNameBalance);
    var recepientUserNameBalance = recepientUserNameRecord._fields[0].properties.balance;
    onsole.log("recepientUserNameBalance :" + recepientUserNameBalance);

    if ('low' in userNameBalance) { // if Neo4j long object, take only number.
        userNameBalance = userNameBalance.low;
    }
    if ('low' in recepientUserNameBalance) { // if Neo4j long object, take only number.
        recepientUserNameBalance = recepientUserNameBalance.low;
    }
    if(userNameBalance<amount){
        return null;
    }
    console.log("recepientUserNameBalance result:" + userNameBalance);
    return Number(recepientUserNameBalance);
}