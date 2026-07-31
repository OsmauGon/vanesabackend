import { Router } from 'express';
//import { prisma } from '../prisma // exporta tu instancia desde un archivo prisma.ts
//import jwt from 'jsonwebtoken';
//import bcrypt from 'bcrypt';

const router = Router();

// POST /login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  /* try {
    // Buscar admin en la base
    const admin = await prisma.admin.findUnique({ where: { email } });

    if (!admin) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    // Comparar password
    const validPassword = await bcrypt.compare(password, admin.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    // Generar JWT
    const token = jwt.sign(
      { id: admin.id, role: 'admin' },
      process.env.JWT_SECRET!,
      { expiresIn: '1h' }
    );

    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error interno del servidor' });
  } */
    // Validación simple (más adelante usaremos DB + bcrypt + JWT)
  if (email === "admin@portal.com" && password === "123456") {
    res.json({ message: "Login correcto ✅", data: "SUCCESS" });
  } else {
    res.status(401).json({ error: "Credenciales inválidas ❌" });
  }
});

export default router;
