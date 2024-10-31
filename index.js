import express from 'express';
import cors from 'cors';
import {ZodError, z} from 'zod'
import sheets, {SHEET_ID} from './sheetClient.js'
// const corsOptions = {
//     origin: [`http://localhost:${process.env.REACT_PORT}`],
//     credentials: true,
//     methods: ["GET", "POST", "PUT", "DELETE"],
// }
const app = express();
app.use(cors());
app.use(express.json());



const contactFormSchema = z.object({
    name:z.string().min(1, {message:'Name is required'}),
    email:z.string().email(),
    status:z.string().min(1, {message:'Messafe is required'})
});
app.use(express.json());



app.post('/send-message', async (req, res) => {
    // console.log(req.body);
    // res.sendStatus(200);
    try{
    const body = contactFormSchema.parse(req.body)
    const rows = Object.values(body);
    await sheets.spreadsheets.values.append({
        spreadsheetId: SHEET_ID,
        range:'Data!A2:C2',
        insertDataOption:'INSERT_ROWS',
        valueInputOption:'RAW',
        requestBody:{
            values:[rows],
        }
    })
    res.status(200).send("true");
    }catch(error){
        if(error instanceof ZodError){
            res.status(400).json({error:error.message})
        }else{
            res.status(500).json({error:error.message})
        }
    }
})

app.listen(6999, ()=>
console.log('app running on port 6999')
)