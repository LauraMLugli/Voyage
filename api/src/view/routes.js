import { Router } from "express";
import userRoutes from "./usersRoutes.js";
import municipiosRoutes from "./municipiosRoutes.js"
import estadosRoutes from "./estadosRoutes.js"
import dependenciasRoutes from "./dependenciaRoutes.js"
import authRoutes from "./authRoutes.js"
import clientes from "./clientesRoutes.js";

const swRoutes = Router();

swRoutes.use(userRoutes);
swRoutes.use(clientes) ;

swRoutes.use( authRoutes) ;

swRoutes.use(municipiosRoutes);
swRoutes.use( estadosRoutes);
swRoutes.use(dependenciasRoutes);


export default swRoutes;