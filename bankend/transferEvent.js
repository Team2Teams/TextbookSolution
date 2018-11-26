var neo4j = require('neo4j-driver').v1;

const neo4jUser = process.env.NEO4J_USER;
const neo4jPassword = process.env.NEO4J_PASSWORD;
const neo4jEndpoint = process.env.NEO4J_ENDPOINT;

function getNeo4jDriver()
{
        console.log("Connecting to neo4j");
        var driver = neo4j.driver(neo4jEndpoint, neo4j.auth.basic(neo4jUser, neo4jPassword));
        console.log("Created neo4j driver.");
        return driver;
}


/********************************************************************** */
// new event - new neo4j node
/********************************************************************** */
module.exports.createTransferEvent = async  (from,to,amount) =>
{
        var driver = getNeo4jDriver();
        const session = driver.session();
        console.log("Started createTransferEvent");
        var eventId=Math.floor(Math.random() * 10000);
        var date = new Date(); 
        var createQuery='CREATE (a:Event { EventId: '+eventId+', Type : "Money Transfer", From : "'+from+'", To : "'+to+'",Amount : '+amount+' , Date : "'+date+'" })';
        const result =session.run(createQuery);
        console.log("Result of createTransferEvent - "+  result);
        return true;
}
