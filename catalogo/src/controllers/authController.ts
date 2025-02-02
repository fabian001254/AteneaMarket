import {Response,Request} from "express"
import jwt from "jsonwebtoken"

import Controller from "./controller";

class authController extends Controller{

    /**
     * Autentica a un usuario y devuelve un token si la autenticación es correcta.
     * @param req Objeto de solicitud de Express.
     * @param res Objeto de respuesta de Express.
     * @returns Token JWT si la autenticación es correcta.
     */
    async autennticacion(req:Request,res:Response){
        const {email} = req.body;
        
        try {
            // Busca al usuario con la tarjeta profesional especificada
            const user = await this.prismaClient.user.findFirst({
                where: { 
                        email: { equals: email}       
                }
            })

            if (!user) {
                // El usuario no existe
                return res.status(401).json({ message: "Invalid email" });
            }
                const payload = {
                    id:user
                }

                const options={
                    expiresIn : "1h"
                }

                const secretKey = process.env.SECRET_KEY

                if(typeof secretKey == "string"){
                    // Si la clave secreta es una cadena, genera un token JWT y lo devuelve
                    const token =jwt.sign(payload,secretKey,options)
                    return res.status(201).json({ message: "Created successfull", token})   
                }   
            }catch (error) {
            // Si ocurre un error durante la autenticación, devuelve un error 400
            res.status(500).json({ message: "Internal error" })
            console.log(error)
            console.log(error)
        } 
    }
}

export default authController
