# Ticket Breakdown

We are a staffing company whose primary purpose is to book Agents at Shifts posted by Facilities on our platform. We're working on a new feature which will generate reports for our client Facilities containing info on how many hours each Agent worked in a given quarter by summing up every Shift they worked. Currently, this is how the process works:

- Data is saved in the database in the Facilities, Agents, and Shifts tables
- A function `getShiftsByFacility` is called with the Facility's id, returning all Shifts worked that quarter, including some metadata about the Agent assigned to each
- A function `generateReport` is then called with the list of Shifts. It converts them into a PDF which can be submitted by the Facility for compliance.

## You've been asked to work on a ticket. It reads:

**Currently, the id of each Agent on the reports we generate is their internal database id. We'd like to add the ability for Facilities to save their own custom ids for each Agent they work with and use that id when generating reports for them.**

Based on the information given, break this ticket down into 2-5 individual tickets to perform. Provide as much detail for each ticket as you can, including acceptance criteria, time/effort estimates, and implementation details. Feel free to make informed guesses about any unknown details - you can't guess "wrong".

You will be graded on the level of detail in each ticket, the clarity of the execution plan within and between tickets, and the intelligibility of your language. You don't need to be a native English speaker, but please proof-read your work.

## Your Breakdown Here

1.  **Create new database table "FacilityAgents" as described:**

    1.1.**Table Schema**

    | FacilityAgentId | FacilityId   | AgentId      | CreatedBy    | CreatedAt       | UpdatedAt        | DeletedAt        |
    | --------------- | ------------ | ------------ | ------------ | --------------- | ---------------- | ---------------- |
    | NVARCHAR(30)    | Unsigned Int | Unsigned Int | Unsigned Int | Timestamp[AUTO] | Timestamp [AUTO] | Timestamp [NULL] |

    1.2.**Primary key**

    `FacilityAgentId, FacilityId`

    1.3.**Foreign keys**

    - _FacilityAgents.FacilityId => Facilities.id_
    - _FacilityAgents.AgentId => Agents.id_
    - _FacilityAgents.CreatedBy => **Users**.id_

      1.4.**Indexes**

    `FacilityId, AgentId, DeletedAt`

    > _Note 1: Since the table names provided were using Uppercase letters, the column names are using same PascalCase pattern to maintain consistency._

    > _Note 2: Assuming that a database table "Users" exists._

    > _Note 3: Instead of using 'String', limiting the 'FacilityAgentId' to 30 characters can improve the performance of uniqueness checks and should be sufficient for an ID_

    > _Note 4: Assuming that the 'Facility Agent Id' must be unique per facility_

2.  **Create new methods**

    2.1 Create the interface type as described:

    ```typescript
        enum FacilityAgentsErrors{
            INVALID_ID: 'Invalid ID',
            DUPLICATE_ID: 'Duplicate ID',
            CREATION_ERROR: 'Cannot create FacilityAgent'
        }

        export interface FacilityAgents {
            agents: Agent[];
        }

        export interface FacilityAgent {
            FacilityAgentId: string;
            FacilityId:      number;
            AgentId:         AgentID;
        }

        export interface AgentID {
            id: string;
            constructor(id: string): {
                if(id.length > 30) throw new Error(FacilityAgentsErrors.INVALID_ID);
                this.id = id;
             };

        }
    ```


    2.2. `function getFacilityAgent(agentId:Number, facilityId:Number): String`:

    This method should query the FacilityAgents, created on ticket #1 using the following criteria:

        SELECT FacilityAgentId FROM "FacilityAgents" WHERE FacilityId = {facilityId} AND AgentId = {agentId} AND  DeletedAt IS NULL;

    If no such record exists, throw an exception "NOT_FOUND"

    2.3. `function createFacilityAgent(agentId:Number, facilityId:Number, FacilityAgentId:String ): Boolean`:

         This method create a new FacilityAgent as described on 2.1 and insert into database table "FacilityAgents"

         Should throw FacilityAgentsErrors.DUPLICATE_ID if SQL duplicate primary key error occurs.
         
        Should throw FacilityAgentsErrors.CREATION_ERROR if any other SQL error occurs.
         

> Note 1: Assuming that system already uses a framework to run database queries safely (SQL Injection preventions, escaping, etc.)

> Note 2: Assuming that can use TypeScript to make code strongly typed, which improves security and avoids the need for custom type-validating code. TypeScript is transpiled to JavaScript during build.

3. **Create new REST endpoint**

   3.1. **New REST endpoint `/facility-agents` must be created**

   3.1.1. `GET`

        Must run getFacilityAgent() method

   3.2.1. `POST`
        Must run createFacilityAgent() method

  `PUT, DELETE, PATCH are out of scope.`

  3.2  **New REST endpoint `/generate-report/v2`**

   3.1.1. `GET`

        Must run getShiftsByFacility() the call ```getFacilityAgent(agentId:Number, facilityId:Number)``` and map the ID returned by the function replacing the field AgentID of the report.

        After replace, must call generateReport()

4. **Create the following unit tests**

    4.1 Call createFacilityAgent with an exiting AgentId, facilityId, and new VALID FacilityAgentId. - Expected: PASS

    4.2 Call createFacilityAgent with an exiting AgentId, facilityId, and new INVALID FacilityAgentId. Expected: FAIL

    4.3 Call createFacilityAgent with an non-exiting AgentId, exiting facilityId, and new VALID FacilityAgentId. Expected: FAIL

    4.3 Call createFacilityAgent with an exiting AgentId, non-exiting facilityId, and new VALID FacilityAgentId. Expected: FAIL

    4.3 Call createFacilityAgent with an non-exiting AgentId, non-exiting facilityId, and new VALID FacilityAgentId. Expected: FAIL

    4.4 Check for PDF layout breaks.

    4.5 If using Javascript directly instead of using typescript, include unit tests for common pitfalls: null, wrong types, undefined types, negative values, array instead of objects, objects instead of arrays.

    