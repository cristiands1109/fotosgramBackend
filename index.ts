import Server from './classes/server';
import userRoutes from './routes/usuario';
import moongose from 'mongoose';
import bodyParser from 'body-parser';
import postRoutes from './routes/post';
import fileUpload  from 'express-fileupload';
import cors from 'cors';


const server = new Server();

// body parser
server.app.use(bodyParser.urlencoded({extended: true}) );
server.app.use(bodyParser.json() );

// FileUpload
server.app.use(fileUpload());

// Configurar CORS
server.app.use(cors({origin: true, credentials: true}));


// rutas de la app
server.app.use('/user', userRoutes);
server.app.use('/post', postRoutes);

// conectar BD
moongose.connect('mongodb://localhost:27017/fotosgram', 
{
    useNewUrlParser: true,
    useCreateIndex: true
},(err) => {
    if (err) throw err;

    console.log('Base de datos ONLINE');
})




// levantar el servidor express
server.start( () => {
    console.log(`Servidor corriendo en el puerto: ${server.port}`);
});
