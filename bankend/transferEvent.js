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
        const createQueryResult =session.run(createQuery);
        console.log("Result of createQueryResult - "+  createQueryResult);

        var fromMatchQuery='MATCH (a:User),(b:Event) ';
        var fromWhereQuery='WHERE a.name = "'+from+'" AND b.EventId = '+eventId+' ';
        var fromCreateQuery='CREATE (a)-[r:From]->(b)';
        var fromFinalQuery= fromMatchQuery+ fromWhereQuery+ fromCreateQuery;
        const fromFinalQueryResult =session.run(fromFinalQuery);
        console.log("Result of fromFinalQueryResult - "+  fromFinalQueryResult);

        var toMatchQuery='MATCH (a:User),(b:Event) ';
        var toWhereQuery='WHERE a.name = "'+to+'" AND b.EventId = '+eventId+' ';
        var toCreateQuery='CREATE (b)-[r:To]->(a)';
        var toFinalQuery= toMatchQuery+ toWhereQuery+ toCreateQuery;
        const toFinalQueryResult =session.run(toFinalQuery);
        console.log("Result of toFinalQueryResult - "+  toFinalQueryResult);

        var findLastQuery='MATCH (a:Event) WHERE a.From= "'+from+'" AND NOT (a)-[:Next]->() RETURN a.EventId';
        var findLastResult = await session.run(findLastQuery);
        console.log("Result of findLastResult - "+  findLastResult);
        //get the event id of the last event for the user
        var formerEventId=findLastResult;

        var nextMatchQuery='MATCH (a:Event),(b:Event) ';
        var nextWhereQuery='WHERE a.EventId = '+formerEventId+' AND b.EventId = '+eventId+' ';
        var nextCreateQuery='CREATE (a)-[r:Next]->(b)';
        var nextFinalQuery= nextMatchQuery+ nextWhereQuery+ nextCreateQuery;
        const nextFinalQueryResult =session.run(toFinalQuery);
        console.log("Result of nextFinalQueryResult - "+  nextFinalQueryResult);

        return true;
}
