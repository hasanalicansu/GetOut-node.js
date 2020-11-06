const express =require("express")
require("./db/dbConnection")

const userRouter=require("./router/userRouter")
const durumRouter=require("./router/durumRouter")
const arkadasRouter=require("./router/arkadasRouter")

const app=express()
app.use(express.json())

app.use("/api/users",userRouter)
app.use("/api/durum",durumRouter)
app.use("/api/arkadas",arkadasRouter)


app.listen(3000, () => {
    console.log("3000 portundan server ayaklandırıldı"); 
});