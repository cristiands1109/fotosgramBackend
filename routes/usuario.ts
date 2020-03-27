import { Router, Request, Response } from "express";
import { Usuario } from '../models/usuario.model';
import bcrypt from 'bcrypt'
import Token from '../classes/token';
import { verificaToken } from '../middlewares/autenticacion';


const userRoutes = Router();

//===================================================================//
//=======================LOGIN DE USUARIO============================//
//===================================================================//

userRoutes.post('/login', (req: Request, resp: Response) => {
    const body = req.body;

    Usuario.findOne({email: body.email}, (err, userDB) => {
        if(err) throw err;

        if(!userDB) {
            return resp.json({
                ok: false,
                mensaje: 'Usuario/Password no son correctos *'
            });
        }
        
        if (userDB.compararPassword(body.password)) {

            const tokenUser = Token.getJwtToken({
                _id: userDB._id,
                nombre: userDB.nombre,
                email: userDB.email,
                avatar: userDB.avatar
            });

            resp.json({
                ok: true,
                usuario: userDB,
                token: tokenUser
            })
        } else {
            return resp.json({
                ok: false,
                mensaje: 'Usuario/Password no son correctos ***'
            });
        }
            
    })
})

//================================================================//
//====================CREACION DE USUARIO=========================//
//================================================================//
userRoutes.post('/create', (req: Request, resp: Response) => {

    const user = {
        nombre: req.body.nombre,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 10),
        avatar: req.body.avatar
    }
    
    Usuario.create(user).then( userDB => {

        const tokenUser = Token.getJwtToken({
            _id: userDB._id,
            nombre: userDB.nombre,
            email: userDB.email,
            avatar: userDB.avatar
        });

        resp.json({
            ok: true,
            usuario: userDB,
            token: tokenUser
        })

    }).catch (err => {
        resp.json({
            ok: false,
            error: err
        })
    });



})

//===================================================================//
//======================ACTUALIZAR USUARIO===========================//
//===================================================================//

userRoutes.post('/update', verificaToken, (req: any, resp: Response) => {

    const user = {
        nombre: req.body.nombre || req.usuario.nombre,
        email: req.body.email || req.usuario.email,
        avatar: req.body.avatar || req.usuario.avatar
    }

    Usuario.findByIdAndUpdate(req.usuario._id, user, {new: true}, (err, userDB: any) => {

       if (err) throw err;
       
       if (!userDB) {
           resp.json({
               ok: false,
               mensaje: 'No existe un usuario con ese ID'
           });
       }

       const tokenUser = Token.getJwtToken({
            _id: userDB._id,
            nombre: userDB.nombre,
            email: userDB.email,
            avatar: userDB.avatar
        });

        resp.json({
            ok: true,
            usuario: userDB,
            token: tokenUser
        })

    });
    
});

userRoutes.get('/', [verificaToken], (req: any, resp: Response) =>{
    const usuario = req.usuario;

    resp.json({
        ok: true,
        usuario
    })
});


export default userRoutes;
