const http = require('http');
const fs = require('fs');
const express = require('express');
const mysql = require('mysql2');

const server = express();

server.use(express.urlencoded({ extended: true }));
server.use(express.static('public')); // sirve HTML, imágenes, CSS, todo

/* --- CONSOLA ---

npm init -y
npm install express
npm install mysql2
npm install -g nodemon

*/

const conexion = mysql.createConnection({
    host: '10.1.15.29',
    user: 'alumno',
    password: 'alumno',
    database: 'Tahis'
});

const cabecera = fs.readFileSync('public/header.html', 'utf8');
const final = fs.readFileSync('public/footer.html', 'utf8');

server.post("/login", (req, res) => {

    const correo = req.body.correo;
    const clave = req.body.clave;

    if ((correo == "tv@gatos.com") && (clave == "demotu")) {
        res.redirect("/gatos");
    } else {
        const contenido = `
            <h1>USUARIO O CLAVE INCORRECTA</h1>
            <br>
            <a href="/"><h2>Volver a intentar</h2></a>
        `;
        res.send(cabecera + contenido + final);
    }
});

//muestra todos los gatos
server.get("/gatos", (req, res) => {

    conexion.query("select * from gatos", (error, data) => {
        let filas = ``;

        if (error || data.length == 0) {
            filas = `
                <tr>
                    <td colspan="6" align="center">NO HAY GATOS REGISTRADOS</td>
                </tr>
            `;
        } else {
            for (const i of data) {
                filas += `
                    <tr>
                        <td>${i.id}</td>
                        <td>${i.nombre}</td>
                        <td>${i.raza}</td>
                        <td>${i.edad} años</td>
                        <td>${i.sexo}</td>
                        <td>${i.color}</td>
                        <td>${i.peso}</td>
                        <td>
                            <a href="/editar_gato?id=${i.id}">Editar</a>&nbsp;
                            <a href="/eliminar_gato?id=${i.id}">Eliminar</a>
                        </td>
                    </tr>
                `;
            }
        }

        const contenido = `
            <h1>Catálogo de Gatos</h1>
            <table border="1" class="tabla_gatos">
                <tr>
                    <td>ID</td><td>NOMBRE</td><td>RAZA</td><td>EDAD</td><td>SEXO</td><td>COLOR</td><td>PESO</td><td>ACCIONAME</td>
                </tr>
                ${filas}
            </table>
            <br>
            <input type="button" name="btn_nuevo" value="AGREGAR NUEVO GATO" onClick="location='/nuevo_gato';">
        `;
        res.send(cabecera + contenido + final);
    });
});

server.get("/nuevo_gato", (req, res) => {

    const contenido = `
        <h1>Nuevo Gato</h1>
        <form name="insertar" action="/insertar_gato" method="POST">
            <table border="1">
                <tr>
                    <td>
                        <table>
                            <tr>
                                <td>Nombre</td><td><input type="text" name="nombre" required></td>
                            </tr>
                            <tr>
                                <td>Raza</td><td><input type="text" name="raza" required></td>
                            </tr>
                            <tr>
                                <td>Edad</td><td><input type="number" name="edad" required></td>
                            </tr>
                            <tr>
                                <td>Sexo</td><td><input type="text" name="sexo" required></td>
                            </tr>
                            <tr>
                                <td>Color</td><td><input type="text" name="color" required></td>
                            </tr>
                            <tr>
                                <td>Peso</td><td><input type="decimal" name="peso" required></td>
                            </tr>
                            <tr>
                                <td colspan="2" align="center">
                                    <input type="submit" name="btn_insertar" value="Crear Gato">
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>
        </form>
    `;
    res.send(cabecera + contenido + final);
});

server.post("/insertar_gato", (req, res) => {

    const nombre = req.body.nombre;
    const raza = req.body.raza;
    const edad = req.body.edad;
    const sexo = req.body.sexo;
    const color = req.body.color;
    const peso = req.body.peso;

    conexion.query(
        "insert into gatos(nombre,raza,edad,sexo,color,peso) values(?,?,?,?,?,?,?)",
        [nombre, raza, edad, sexo, color, peso],
        (err, data) => {
            if (err) {
                const contenido = `
                    <h1>ERROR AL INSERTAR</h1>
                    <input type="button" name="btn" value="Regresar al Catálogo" onClick="location='/gatos';">
                `;
                res.send(cabecera + contenido + final);
            } else {
                const contenido = `
                    <script>
                        alert("Gato agregado correctamente");
                        location="/gatos";
                    </script>
                `;
                res.send(cabecera + contenido + final);
            }
        }
    );
});

server.get("/editar_gato", (req, res) => {

    const id_recibido = req.query.id;

    conexion.query("select * from gatos where id=?", [id_recibido], (err, data) => {

        if (err || data.length == 0) {
            const contenido = `
                <h1>NO EXISTE UN GATO CON ESE ID</h1>
                <input type="button" name="btn" value="Regresar al Catálogo" onClick="location='/gatos';">
            `;
            res.send(cabecera + contenido + final);
        } else {
            const g = data[0];
            const contenido = `
                <h1>Editar Gato</h1>
                <form name="editar" action="/actualizar_gato" method="POST">
                    <input type="hidden" name="id" value="${g.id}">
                    <table border="1">
                        <tr>
                            <td>
                                <table>
                                    <tr>
                                        <td>Nombre</td><td><input type="text" name="nombre" value="${g.nombre}"></td>
                                    </tr>
                                    <tr>
                                        <td>Raza</td><td><input type="text" name="raza" value="${g.raza}"></td>
                                    </tr>
                                    <tr>
                                        <td>Edad</td><td><input type="number" name="edad" value="${g.edad}"></td>
                                    </tr>
                                    <tr>
                                        <td>Sexo</td><td><input type="text" name="sexo" value="${g.sexo}"></td>
                                    </tr>
                                    <tr>
                                        <td>Color</td><td><input type="text" name="color" value="${g.color}"></td>
                                    </tr>
                                    <tr>
                                        <td>Peso</td><td><input type="decimal" name="peso" value="${g.peso}"></td>
                                    </tr>
                                    <tr>
                                        <td colspan="2" align="center">
                                            <input type="submit" name="btn_actualizar" value="Actualizar Gato">
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                    </table>
                </form>
            `;
            res.send(cabecera + contenido + final);
        }
    });
});

server.post("/actualizar_gato", (req, res) => {

    const id_recibido = req.body.id;
    const nombre = req.body.nombre;
    const raza = req.body.raza;
    const edad = req.body.edad;
    const sexo = req.body.sexo;
    const color = req.body.color;
    const peso = req.body.peso;

    conexion.query(
        "update gatos set nombre=?, raza=?, edad=?, sexo=?, color=?, peso=? where id=?",
        [nombre, raza, edad, sexo, color, peso, id_recibido],
        (err, data) => {
            if (err) {
                const contenido = `
                    <h1>ERROR AL ACTUALIZAR</h1>
                    <input type="button" name="btn" value="Regresar al Catálogo" onClick="location='/gatos';">
                `;
                res.send(cabecera + contenido + final);
            } else {
                const contenido = `
                    <script>
                        alert("Gato actualizado");
                        location="/gatos";
                    </script>
                `;
                res.send(cabecera + contenido + final);
            }
        }
    );
});

//pregunta antes de borrar
server.get("/eliminar_gato", (req, res) => {

    const id_recibido = req.query.id;

    conexion.query("select * from gatos where id=?", [id_recibido], (err, data) => {

        if (err || data.length == 0) {
            const contenido = `
                <h1>NO EXISTE UN GATO CON ESE ID</h1>
                <input type="button" name="btn" value="Regresar al Catálogo" onClick="location='/gatos';">
            `;
            res.send(cabecera + contenido + final);
        } else {
            const nombre_gato = data[0].nombre;
            const contenido = `
                <h1>¿Está seguro(a) que desea eliminar a <b>${nombre_gato}</b>?</h1>
                <input type="button" name="btn1" value="SI" onClick="location='/confirmar_eliminacion?id=${id_recibido}';">
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <input type="button" name="btn2" value="NO" onClick="location='/gatos';">
            `;
            res.send(cabecera + contenido + final);
        }
    });
});

server.get("/confirmar_eliminacion", (req, res) => {

    const id_recibido = req.query.id;

    conexion.query("delete from gatos where id=?", [id_recibido], (err, data) => {
        if (err) {
            const contenido = `
                <h1>ERROR AL ELIMINAR</h1>
                <input type="button" name="btn" value="Regresar al Catálogo" onClick="location='/gatos';">
            `;
            res.send(cabecera + contenido + final);
        } else {
            const contenido = `
                <script>
                    alert("Gato eliminado");
                    location="/gatos";
                </script>
            `;
            res.send(cabecera + contenido + final);
        }
    });
});

server.listen(3002, () => {
    console.log('Servidor de Gatopedia iniciado en http://localhost:3002 (OK)');
});