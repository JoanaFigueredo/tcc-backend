import { PrismaClient } from "@prisma/client";
import fastify from "fastify";

const app = fastify();

const prisma = new PrismaClient();

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

app.get("/users", async () => {
  const users = await prisma.user.findMany();

  return { users };
});

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

app.get("/assignments/:userId", async (request) => {
  const { userId } = request.params;

  const assignments = await prisma.assignment.findMany({
    where: {
      userId,
    },
  });

  return { assignments };
});

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

app.get("/todos/:userId", async (request, reply) => {
  const { userId } = request.params;
  const todos = await prisma.todo.findMany({
    where: {
      userId,
    },
  });

  return { todos };
});

app.post("/todos/:userId", async (request, reply) => {
  const { title, description, isComplete } = request.body;
  const { userId } = request.params;
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });
  if (!user) {
    return reply.status(401).send({ message: "User not found" });
  }
  const todo = await prisma.assignment.create({
    data: {
      userId,
      title,
      description,
      isComplete,
    },
  });
  return reply.status(201).send({ todo });
});

app.get("/subjects/:userId", async (request, reply) => {
  const { userId } = request.params;
  const subjects = await prisma.subject.findMany({
    where: {
      userId,
    },
  });

  return { subjects };
});

app.post("/subjects/:userId", async (request, reply) => {
  const { userId } = request.params;
  const { name, calculation } = request.body;
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) {
    return reply.status(401).send({ message: "User not found" });
  }
  const subject = await prisma.assignment.create({
    data: {
      userId,
      name,
      calculation,
    },
  });
  return reply.status(201).send({ subject });
});

app.get("/grades/:subjectId", async (request, reply) => {
  const { subjectId } = request.params;
  const grades = await prisma.grade.findMany({
    where: {
      subjectId,
    },
  });

  return { grades };
});

app.post("/grades/:subjectId", async (request, reply) => {
  const { subjectId } = request.params;
  const subject = await prisma.subject.findUnique({
    where: {
      id: subjectId,
    },
  });
  if (!subject) {
    return reply.status(401).send({ message: "Subject not found" });
  }
  const { label, value, weight } = request.body;
  const grade = await prisma.grade.create({
    data: {
      subjectId,
      label,
      value,
      weight,
    },
  });
  return reply.status(201).send({ grade });
});

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
