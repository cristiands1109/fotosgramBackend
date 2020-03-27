import { Router, Response } from 'express';
import { verificaToken } from '../middlewares/autenticacion';
import { Post } from '../models/post.model';
import { FileUpload } from '../interfaces/file-upload';
import FileSystem from '../classes/file-system';



const postRoutes = Router();
const fileSystem = new FileSystem

// Obtener POST paginados
postRoutes.get('/', async (req: any, res: Response) => {

    let pagina = Number(req.query.pagina) || 1;
    let skip = pagina - 1;
    skip = skip * 10;

    const posts = await Post.find()
                            .sort({ _id: -1 })
                            .skip( skip )
                            .limit(10)
                            .populate('usuario', '-password')
                            .exec();


    res.json({
        ok: true,
        pagina,
        posts
    });

});


// crear post

postRoutes.post('/', [verificaToken], (req: any, resp: Response) =>{

    const body =req.body;
    body.usuario = req.usuario._id;

    const imagenes = fileSystem.imagenesDeTempHaciaPost(req.usuario._id);
    body.imgs = imagenes;

    Post.create(body).then(async postDB => {
        await postDB.populate('usuario', '-password').execPopulate();
        resp.json({
            ok: true,
            post: postDB
        })
    }).catch( err => {
        resp.json(err)
    });

});

// servicios para subir archivos

postRoutes.post('/upload', [verificaToken], async (req: any, resp: Response) => {

    if ( !req.files ) {
        return resp.status(400).json({
            ok: false,
            mensaje: 'No se subio archivo alguno'
        })
    }
    const file: FileUpload = req.files.image;
    
    if (! file) {
        return resp.status(400).json({
            ok: false,
            mensaje: 'No se subio archivo alguno / image'
        })
    }

    if ( !file.mimetype.includes('image') ) {
        return resp.status(400).json({
            ok: false,
            mensaje: 'Esto NO ES una IMAGEN'
        })
    }

    await fileSystem.guardarImagenTemporal(file, req.usuario._id);

    resp.json({
        ok: true,
        mensaje: 'imagen subida',
        file: file.mimetype
    })
})

postRoutes.get('/imagen/:userid/:img', (req: any, resp: Response) => {

    const userId = req.params.userid;
    const img = req.params.img;


    const pathFoto= fileSystem.getFotoUrl(userId, img);

    resp.sendFile(pathFoto);

})









export default postRoutes;