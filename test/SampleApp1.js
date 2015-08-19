

var dbobj = require('ifx_db');

function DirExec(conn, ErrIgn, sql)
{
    try
    {
        var result = conn.querySync(sql);
        console.log(sql);
    }
    catch (e)
    {
        console.log("--- " + sql);
        if (ErrIgn != 1)
        {
            console.log(e);
            console.log();
        }
    }
}

function DoSomeWork(err, conn)
{
    if (err)
    {
        return console.log(err);
    }

    DirExec(conn, 1, "drop table t1");
    DirExec(conn, 0, "create table t1 ( c1 int, c2 char(20) ) ");
    DirExec(conn, 0, "insert into t1 values( 1, 'val-1' )");
    DirExec(conn, 0, "insert into t1 values( 2, 'val-2' )");
    DirExec(conn, 0, "insert into t1 values( 3, 'val-3' )");
    DirExec(conn, 0, "insert into t1 values( 4, 'val-4' )");
    DirExec(conn, 0, "insert into t1 values( 5, 'val-5' )");

    console.log();
    console.log(" --- SELECT * FROM t1 ------ ");
    // blocks until the query is completed and all data has been acquired
    var rows = conn.querySync("SELECT * FROM t1");
    console.log();
    console.log(rows);
};


var MyAsynchronousTask = function (err, conn)
{
    DoSomeWork(err, conn);
    conn.close();
}

function ifx_db_Open(ConStr)
{
    console.log();
    console.log(" --- MyAsynchronousTask Starting.....");
    dbobj.open(ConStr, MyAsynchronousTask);
    //dbobj.close(function () {});
    console.log(" --- Log Message sequence... ?");
    console.log(" --- You are on Asynchronous call! :)");
}

function ifx_db_OpenSync(ConStr)
{
    console.log();
    console.log(" --- Executing ifx_db.openSync() ....");
    var conn;
    try
    {
        conn = dbobj.openSync(ConStr);
    }
    catch (e)
    {
        console.log(e);
        return;
    }

    DoSomeWork(0, conn);

    try
    {
        //dbobj.closeSync();
        conn.closeSync();
    }
    catch (e)
    {
        console.log(e);
    }
    console.log(" --- End ifx_db.openSync()");
}

function main_func()
{
    var ConnectionString = "SERVER=ids0;DATABASE=ids0db1;HOST=blue.ibm.com;PROTOCOL=onsoctcp;SERVICE=5550;UID=informix;PWD=xxxx;";

    if (process.argv.length == 3 && process.argv[2] == "norun")
    {
        console.log();
        console.log("Please modify the connection string and run the Sample.");
        console.log("Here is a sample connection string");
        console.log();
        console.log("\"" + ConnectionString + "\"");
        console.log();
        return;
    }

    //Synchronous Execution
    ifx_db_OpenSync(ConnectionString);

    //Asynchronous Execution
    ifx_db_Open(ConnectionString);
}

main_func();



