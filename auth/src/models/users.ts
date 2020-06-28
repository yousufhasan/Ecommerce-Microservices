import mongoose from 'mongoose';
import { Password } from '../services/password';

interface UserAttrs {
    email: string,
    password: string
}

/* An interface that describes the properties that a user model has */
interface UserModel extends mongoose.Model<UserDoc>{
    build(attrs: UserAttrs): UserDoc;
}
/* An interface that descibes the properies that a user document has */
interface UserDoc extends mongoose.Document{
    email: string,
    password: string
}

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
},{
    toJSON: {
        transform(doc, ret){
            ret.id = ret._id;
            delete ret._id;
            delete ret.password;
            delete ret.__v;
        }
    }
});
userSchema.pre('save', async function(done){
    if(this.isModified('password')) {
        const hashedPassword = await Password.toHash(this.get('password'));
        this.set('password', hashedPassword);
    }
    done();
});
/* This function is required to make typescript work properly
with mongoose and do a proper type checking. */
userSchema.statics.build = (attr: UserAttrs) => {
    return new User(attr);
}
const User = mongoose.model<UserDoc, UserModel>('User', userSchema);

export { User };