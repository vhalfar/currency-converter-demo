## Run Docker environment

Run this command to create a new database server instance: 
```
docker run --name <name> -d -e POSTGRES_USER=<username> -e POSTGRES_PASSWORD=<password> -e POSTGRES_DB=<database> --restart unless-stopped postgres
```

## Run DDL statements

DDL statements are stored in the file `ddl.sql`
