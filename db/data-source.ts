import { DataSource, DataSourceOptions } from 'typeorm';
import { config } from 'dotenv';
config()
export const dataSourceOptions: DataSourceOptions = {
    type: 'postgres',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    entities: ['dist/**/*.entity.js'], 
    migrations: ['dist/db/migrations/*.js'], 
    logging: false,
    synchronize:false,
};



const dataSource = new DataSource(dataSourceOptions);
dataSource.initialize().then(()=>{
    console.log("DataSource has been initialised")
    console.log("Entities being used:", dataSource.options.entities)
    
})
.catch((err)=>{
    console.log("Error during Datasource initialization",err)
})

export default dataSource;
