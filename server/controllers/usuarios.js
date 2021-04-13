const { response } = require('express');
const bcrypt = require('bcryptjs');
const Usuario = require('./../models/usuario.model');
const { generarJWT } = require('../helpers/jwt');
const { esGestor } = require('../helpers/auth');
const { ROL_GESTOR } = require('./../models/rol.model');
const dao_usuario = require('../database/services/daos/daoUsuario');
var TEntidad = require('../database/services/transfers/TEntidad');
const TEstudiante = require('../database/services/transfers/TEstudiante');
const TEstudianteExterno = require('../database/services/transfers/TEstudianteExterno');
const TProfesorExterno = require('../database/services/transfers/TProfesorExterno');

const getUsuarios = async(req, res) => {
    try {
        const skip = Number(req.query.skip) || 0;
        const limit = Number(req.query.limit) || Number.MAX_SAFE_INTEGER;

        const filtros = JSON.parse(req.query.filtros || '{}');

        let conditions = [];

        // filtro por texto (titulo)
        if(filtros.terminoBusqueda.trim() !== '') {
            let regex = new RegExp( filtros.terminoBusqueda.trim(), 'i')
            conditions.push(
                { $or: [{ nombre: regex }, { apellidos: regex }, { email: regex }, { universidad: regex }, { titulo: regex }, { sector: regex }, { rol: regex }, { origin_login: regex } ]}
            );
        }

        const [usuarios, filtradas, total] = await Promise.all([
            Usuario
                .find(conditions.length ? { $and: conditions} : {})
                .sort('-createdAt')
                .skip(skip)
                .limit(limit),

            Usuario.find(conditions.length ? { $and: conditions} : {}).countDocuments(),

            Usuario.countDocuments(),
        ]);

        return res.status(200).json({
            ok: true,
            usuarios,
            filtradas: filtradas,
            total: total,
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            ok: false,
            msg: 'Error inesperado',
        });
    }
}


const getUsuario = async(req, res) => {
    console.log("entra")
    try {
        const uid = req.params.uid;
        const usuario = await dao_usuario.obtenerUsuarioSinRolPorId(uid);

        return res.status(200).json({
            ok: true,
            usuario,
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            ok: false,
            msg: 'Error inesperado',
        });
    }
}


const crearUsuario = async (req, res = response) => {

    const { email, password } = req.body;

    try {

        if (req.body.rol === 'ROL_ENTIDAD') {
            let existeEmail = await dao_usuario.obtenerUsuarioSinRolPorEmail(email)
            if (existeEmail !== 0) {
                return res.status(400).json({
                    ok: false,
                    msg: 'El correo ya está registrado',
                });

            }

            let passwordNew = bcrypt.hashSync(password, bcrypt.genSaltSync());

            // solo un usuario gestor puede crear otro gestor
            if (req.body.rol === ROL_GESTOR && !esGestor(req)) {
                return res.status(403).json({
                    ok: false,
                    msg: 'Operación no autorizada, solo gestores.',
                });
            }
            let entidad = new TEntidad(null,email,req.body.nombre,req.body.apellidos,passwordNew,"APS","imagen","lll","kkk",req.body.terminos_aceptados,req.body.sector,"prueba")
           
            if(await dao_usuario.insertarEntidad(entidad) ===-1){
                return res.status(400).json({
                    ok: false,
                    msg: 'Ha ocurrrido un error',
                });  
            }

            const token = await generarJWT(entidad);

            return res.status(200).json({
                ok: true,
                usuario: entidad,
                token: token,
            });
        }else  if(req.body.rol === 'ROL_ESTUDIANTE'){
            let existeEmail = await dao_usuario.obtenerUsuarioSinRolPorEmail(email)
            if (existeEmail !== 0) {
                return res.status(400).json({
                    ok: false,
                    msg: 'El correo ya está registrado',
                });

            }

            let passwordNew = bcrypt.hashSync(password, bcrypt.genSaltSync());

            // solo un usuario gestor puede crear otro gestor
            if (req.body.rol === ROL_GESTOR && !esGestor(req)) {
                return res.status(403).json({
                    ok: false,
                    msg: 'Operación no autorizada, solo gestores.',
                });
            }
 
            let estudiante = new TEstudianteExterno(null,email,req.body.nombre,req.body.apellidos,passwordNew,"Portal ApS","imagen","lll","kkk",req.body.terminos_aceptados,1,
            req.body.titulacion,
            req.body.universidad,
            null)
            let id=await dao_usuario.insertarEstudianteExterno(estudiante);
            if( id ===-1){
                return res.status(400).json({
                    ok: false,
                    msg: 'Ha ocurrrido un error',
                });  
            }
            let estu= {
                uid: id,
                email: email,
                  rol:req.body.rol,
                  password: passwordNew,
                  password_2:passwordNew,
                  nombre: req.body.nombre,
                  apellidos: req.body.apellidos,
                  universidad: req.body.universidad,
                  titulacion: req.body.universidad,
                  terminos_aceptados: req.body.terminos_aceptados
            }
            const token = await generarJWT(estu);

            return res.status(200).json({
                ok: true,
                usuario: estu,
                token: token,
            });
        }
        else if(req.body.rol === 'ROL_PROFESOR'){
            let existeEmail = await dao_usuario.obtenerUsuarioSinRolPorEmail(email)
            if (existeEmail !== 0) {
                return res.status(400).json({
                    ok: false,
                    msg: 'El correo ya está registrado',
                });

            }

            let passwordNew = bcrypt.hashSync(password, bcrypt.genSaltSync());

            // solo un usuario gestor puede crear otro gestor
            if (req.body.rol === ROL_GESTOR && !esGestor(req)) {
                return res.status(403).json({
                    ok: false,
                    msg: 'Operación no autorizada, solo gestores.',
                });
            }
            let profesor = new TProfesorExterno(null,email,req.body.nombre,req.body.apellidos,passwordNew,"APS","imagen","lll","kkk",req.body.terminos_aceptados,1,req.body.universidad,"prueba")
            
            if( await dao_usuario.insertarProfesorExterno(profesor) ===-1){
                return res.status(400).json({
                    ok: false,
                    msg: 'Ha ocurrrido un error',
                });  
            }

            const token = await generarJWT(profesor);

            return res.status(200).json({
                ok: true,
                usuario: profesor,
                token: token,
            });
        }


    } catch (error) {

        console.error(error);

        return res.status(500).json({
            ok: false,
            msg: 'Error inesperado',
        });
    }
}

const actualizarUsuario = async(req, res = response) => {

    const uid = req.params.id;

    try {
        const usuario = await dao_usuario.obtenerUsuarioSinRolPorId(uid);

        if(!usuario) {
            return res.status(404).json({
                ok: false,
                msg: 'El usuario no existe',
            });
        }

        // si actualiza a otro que no soy yo, debo ser gestor
        if(uid !== usuario.id && !esGestor(req)) {
            return res.status(403).json({
                ok: false,
                msg: 'Operación no autorizada, solo gestores.',
            });
        }

        const campos = req.body;

        // comprobar si quiere cambiar su email
        if( usuario.email === campos.email ) {
            delete campos.email;
        }

        // solo se puede cambiar el email en cuentas creadas desde el propio portal
        if(campos.email && usuario.origin_login !== 'Portal ApS') {
            return res.status(403).json({
                ok: false,
                msg: 'No está permitido cambiar el email para cuentas que han utilizado el SSO de ' + usuario.origin_login + '.',
            });
        }

        // si lo quiere cambiar, comprobar que no existe uno igual
        if(campos.email) {
            // const existeEmail = await Usuario.findOne({ email: campos.email });
            const existeEmail = await dao_usuario.obtenerUsuarioSinRolPorEmail(campos.email);
            if(existeEmail && uid !== existeEmail.id) {
                return res.status(400).json({
                    ok: false,
                    msg: 'El correo ya está registrado',
                });
            }
        }

        // si la contraseña no viene vacia, es que la quiere cambiar
        if(campos.password) {
            campos.password = bcrypt.hashSync(campos.password, bcrypt.genSaltSync());
        } else {
            delete campos.password;
        }

        // nunca se puede cambiar el campo origin_login: UNED lo determina el tipo de login desde el SSO de la UNED, o google lo determina GOOGLE
        delete campos.origin_login;

        // solo el gestor puede cambiar el rol, aunque no debería por coherencia de datos en proyectos
        if((campos.rol === usuario.rol) || !esGestor(req)) {
            delete campos.rol;
        }
        else {
            // si era una entidad, borrale el sector
            if(usuario.rol == 'ROL_ENTIDAD') {
                campos.sector = '';
            }

            // si deja de ser estudiante o profesor, borra universidad y titulacion
            if(['ROL_ESTUDIANTE', 'ROL_PROFESOR'].includes(usuario.rol) && !['ROL_ESTUDIANTE', 'ROL_PROFESOR'].includes(campos.rol)) {
                campos.universidad = '';
                campos.titulacion = '';
            }
        }



        const usuarioActualizado = await Usuario.findByIdAndUpdate(uid, campos, { new: true });
        const token = await generarJWT(usuarioActualizado);

        return res.status(200).json({
            ok: true,
            token,
            usuario: usuarioActualizado
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            ok: false,
            msg: 'Error inesperado',
        });
    }
}

const borrarUsuario = async(req, res = response) => {

    const uid = req.params.id;

    try {
        // const usuario = await Usuario.findById(uid);
        const usuario = await dao_usuario.obtenerUsuarioSinRolPorId(uid);

        if(!usuario) {
            return res.status(404).json({
                ok: false,
                msg: 'El usuario no existe',
            });
        }

        // solo gestores
        if(!esGestor(req)) {
            return res.status(403).json({
                ok: false,
                msg: 'Operación no autorizada, solo gestores.',
            });
        }

        // no se puede borrar a uno mismo
        if(uid === req.current_user.uid) {
            return res.status(403).json({
                ok: false,
                msg: 'Operación no autorizada, no se puede borrar a uno mismo.',
            });
        }

        // borrado real
        const usuarioBorrado = await Usuario.findByIdAndDelete(uid);

        return res.status(200).json({
            ok: true,
            usuario: usuarioBorrado
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            ok: false,
            msg: 'Error inesperado',
        });
    }
}

module.exports = {
    getUsuarios,
    getUsuario,
    crearUsuario,
    actualizarUsuario,
    borrarUsuario,
}