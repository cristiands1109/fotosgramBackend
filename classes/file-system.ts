import { FileUpload } from '../interfaces/file-upload';
import fs from 'fs'
import path from 'path'
import uniqid from 'uniqid';



export default class FileSystem {


    constructor () {}


    guardarImagenTemporal( file: FileUpload, userId: string) {

        return new Promise( (resolve, reject) => {
            
                    // crear carpetas
                    const path = this.crearCarpetaUsuario(userId);
            
                    // nombre de archivos
                    const nombreArchivo = this.generarNombreUnico(file.name)
                    // console.log('nombre original',file.name); 
                    // console.log('nombre unico archivo', nombreArchivo);
            
                    // mover el archivo temp a nuestra carpeta
                    file.mv(`${path}/${nombreArchivo}`, (err: any) => {
                        if (err) {
                           reject(err);
                        } else {
                            resolve();
                        }
                    })
        });


    }


    private generarNombreUnico (nombreOriginal: string) {

        const nombreArr = nombreOriginal.split('.');
        const extension = nombreArr [nombreArr.length - 1];
        const idUnico = uniqid();

        return `${idUnico}.${extension}`;

    }

    private crearCarpetaUsuario(userId: string) {

        const pathUser = path.resolve(__dirname, '../uploads/', userId);
        const pathUserTemp = pathUser + '/temp';
        console.log(pathUser);


        const existe = fs.existsSync(pathUser);
        
        if (!existe) {
            fs.mkdirSync(pathUser);
            fs.mkdirSync(pathUserTemp);
        }

        return pathUserTemp;


    }

    imagenesDeTempHaciaPost(userId: string) {

        const pathTemp = path.resolve(__dirname, '../uploads/', userId, 'temp');
        const pathPost = path.resolve(__dirname, '../uploads/', userId, 'posts');

        // se verifica si existe la carpeta Temp y sino existe entonces lo llena
        // con un arreglo vacio

        if (!fs.existsSync(pathTemp)) {
            return [];
        }

        // verifica si existe la carpeta post, en caso que no exista lo crea
        if (!fs.existsSync(pathPost)) {
            fs.mkdirSync(pathPost);
        }

        // metodo para mover de la carpeta Temp a la carpeta Post

        const imagenesTemp = this.obtenerImagenesEnTemp(userId);

        imagenesTemp.forEach(imagen =>{
            fs.renameSync(`${pathTemp}/${imagen}`, `${pathPost}/${imagen}`)
        });

        return imagenesTemp;

    }

    private obtenerImagenesEnTemp(userId: string) {
        const pathTemp = path.resolve(__dirname, '../uploads/', userId, 'temp');

        return fs.readdirSync(pathTemp) || [];
    }

    getFotoUrl(userId: string, img: string) {

        // reconstruccion de path imagen

        const pathFoto = path.resolve(__dirname, '../uploads', userId, 'posts', img)

        // si la imagen no existe

        const existe = fs.existsSync(pathFoto);

        if(!existe) {
           return path.resolve(__dirname, '../assets/400x250.jpg') 
        }

        return pathFoto;

    }

}