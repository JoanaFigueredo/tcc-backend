import { PrismaClient } from "@prisma/client";
import fastify from "fastify";
import fastifyCors from "@fastify/cors";

const app = fastify();

// Configuração do Prisma
const prisma = new PrismaClient();

// Habilitar CORS para todas as rotas
app.register(fastifyCors, {
  origin: true, // Permitir requisições de qualquer origem
  methods: ["GET", "POST", "PUT", "DELETE"], // Métodos permitidos
});

// Rota de login
app.post("/login", async (request, reply) => {
  const { email, password } = request.body;
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    return reply.status(401).send({ message: "User not found" });
  }

  if (user.password !== password) {
    return reply.status(401).send({ message: "Invalid password" });
  }

  return { user };
});

// Listar usuários
app.get("/users", async () => {
  const users = await prisma.user.findMany();
  return { users };
});

// Criar um novo usuário
app.post("/users", async (request, reply) => {
  const { name, email, password } = request.body;

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password,
    },
  });
  return reply.status(201).send({ user });
});

// Atualizar informações de um usuário
app.put("/users/:userId", async (request, reply) => {
  const { userId } = request.params;
  const { name, email, password } = request.body;

  const user = await prisma.user.update({
    where: { id: userId },
    data: { name, email, password },
  });

  return reply.status(200).send({ user });
});

// Listar tarefas de um usuário
app.get("/assignments/:userId", async (request) => {
  const { userId } = request.params;

  const assignments = await prisma.assignment.findMany({
    where: {
      userId,
    },
  });

  return { assignments };
});

// Criar uma nova tarefa
app.post("/assignments/:userId", async (request, reply) => {
  const { subject, deadline, title } = request.body;
  const { userId } = request.params;
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) {
    return reply.status(401).send({ message: "User not found" });
  }
  const assignment = await prisma.assignment.create({
    data: {
      userId,
      subject,
      deadline,
      title,
    },
  });
  return reply.status(201).send({ assignment });
});

// Deletar uma tarefa
app.delete("/assignments/:assignmentId", async (request, reply) => {
  const { assignmentId } = request.params;
  const deletedUsers = await prisma.assignment.delete({
    where: { id: assignmentId },
  });

  reply.status(200).send({ deletedUsers });
});

// Editar uma tarefa
app.put("/assignments/:assignmentId", async (request, reply) => {
  const { assignmentId } = request.params;
  const { subject, deadline, title } = request.body;

  const assignment = await prisma.assignment.update({
    where: { id: assignmentId },
    data: { subject, deadline, title },
  });

  return reply.status(200).send({ assignment });
});

// Rotas para todos os outros recursos (todos, subjects, grades) seguem a mesma estrutura.

// Inicializar servidor
app
  .listen({
    host: "0.0.0.0",
    port: process.env.PORT ? Number(process.env.PORT) : 3333,
  })
  .then(() => {
    console.log(
      `HTTP server running on http://localhost:${process.env.PORT || 3333}`
    );
  });
