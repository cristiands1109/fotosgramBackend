

import { Schema, Document, model } from 'mongoose';


const postSchema = new Schema({
    create: {
        type: Date
    },
    mensaje: {
        type: String
    },
    imgs: [{
        type: String
    }],
    coords: {
        type: String // se suben las coordenadas para la ubicacion
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'usuario',
        required: [true, 'Debe de existir una referencia a un usuario']
    }
});

postSchema.pre<IPost>('save', function(next) {
    this.created = new Date();
    next ();
});

interface IPost extends Document {
    created: Date;
    mensaje: string;
    img: string [];
    coords: string
    usuario: string    
}


export const Post = model<IPost>('Post', postSchema);
