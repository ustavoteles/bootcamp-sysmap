import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Hash para senha padrão "123" (apenas para desenvolvimento)
  const hashedPassword = await hash("123", 10);

  // 1. Usuários com senha "123"
  const users = await prisma.users.createMany({
    data: [
      {
        name: "João Silva",
        email: "joao@example.com",
        cpf: "111.111.111-11",
        password: hashedPassword,
        xp: 150,
        level: 2,
        avatar: "joao.jpg",
      },
      {
        name: "Maria Souza",
        email: "maria@example.com",
        cpf: "222.222.222-22",
        password: hashedPassword,
        xp: 300,
        level: 4,
        avatar: "maria.jpg",
      },
      {
        name: "Carlos Oliveira",
        email: "carlos@example.com",
        cpf: "333.333.333-33",
        password: hashedPassword,
        xp: 50,
        level: 1,
      },
      {
        name: "Ana Santos",
        email: "ana@example.com",
        cpf: "444.444.444-44",
        password: hashedPassword,
        xp: 500,
        level: 5,
        avatar: "ana.jpg",
      },
    ],
    skipDuplicates: true,
  });

  // 2. Tipos de Atividades
  const activityTypes = await prisma.activityTypes.createMany({
    data: [
      {
        name: "Yoga",
        description: "Prática de posturas e respiração",
        image: "yoga.png",
      },
      {
        name: "Corrida",
        description: "Corrida ao ar livre",
        image: "running.png",
      },
      {
        name: "Futebol",
        description: "Jogo de futebol recreativo",
        image: "soccer.png",
      },
      {
        name: "Workshop",
        description: "Oficina de aprendizado",
        image: "workshop.png",
      },
      {
        name: "Meditação",
        description: "Sessão guiada de meditação",
        image: "meditation.png",
      },
    ],
    skipDuplicates: true,
  });

  // 3. Conquistas
  const achievements = await prisma.achievements.createMany({
    data: [
      {
        name: "Primeiros Passos",
        criterion: "Complete sua primeira atividade",
      },
      {
        name: "Atleta",
        criterion: "Participe de 5 atividades físicas",
      },
      {
        name: "Organizador",
        criterion: "Crie 3 atividades",
      },
      {
        name: "Social",
        criterion: "Convide amigos para 2 atividades",
      },
      {
        name: "Mestre",
        criterion: "Alcance nível 5",
      },
    ],
    skipDuplicates: true,
  });

  // 4. Obter registros criados para relações
  const [joao, maria, carlos, ana] = await prisma.users.findMany();
  const [yoga, corrida, futebol, workshop, meditacao] =
    await prisma.activityTypes.findMany();
  const [primeirosPassos, atleta, organizador, social, mestre] =
    await prisma.achievements.findMany();

  // 5. Atividades com endereços (10 atividades variadas)
  const activities = await Promise.all([
    // Yoga
    prisma.activities.create({
      data: {
        title: "Yoga no Parque",
        description: "Aula ao ar livre para todos os níveis",
        typeId: yoga.id,
        confirmationCode: "YOGA123",
        image: "yoga_park.jpg",
        scheduledDate: new Date("2025-04-05T08:00:00Z"),
        private: false,
        creatorId: joao.id,
        ActivityAddresses: {
          create: {
            latitude: -23.5505,
            longitude: -46.6333, // São Paulo
          },
        },
      },
    }),

    // Corrida
    prisma.activities.create({
      data: {
        title: "Corrida Noturna",
        description: "5km pela orla",
        typeId: corrida.id,
        confirmationCode: "RUN456",
        image: "night_run.jpg",
        scheduledDate: new Date("2025-04-10T19:00:00Z"),
        private: false,
        creatorId: maria.id,
        ActivityAddresses: {
          create: {
            latitude: -22.9068,
            longitude: -43.1729, // Rio de Janeiro
          },
        },
      },
    }),

    // Futebol
    prisma.activities.create({
      data: {
        title: "Pelada Semanal",
        description: "Futebol recreativo",
        typeId: futebol.id,
        confirmationCode: "FTB789",
        image: "soccer_game.jpg",
        scheduledDate: new Date("2025-04-07T17:00:00Z"),
        private: false,
        creatorId: carlos.id,
        ActivityAddresses: {
          create: {
            latitude: -15.7942,
            longitude: -47.8822, // Brasília
          },
        },
      },
    }),

    // Workshop
    prisma.activities.create({
      data: {
        title: "Oficina de React",
        description: "Introdução ao React Hooks",
        typeId: workshop.id,
        confirmationCode: "DEV101",
        image: "react_workshop.jpg",
        scheduledDate: new Date("2025-04-12T14:00:00Z"),
        private: true,
        creatorId: ana.id,
        ActivityAddresses: {
          create: {
            latitude: -12.9714,
            longitude: -38.5014, // Salvador
          },
        },
      },
    }),

    // Meditação
    prisma.activities.create({
      data: {
        title: "Meditação Guiada",
        description: "Sessão para redução de estresse",
        typeId: meditacao.id,
        confirmationCode: "MEDITA202",
        image: "meditation_session.jpg",
        scheduledDate: new Date("2025-04-08T07:00:00Z"),
        private: false,
        creatorId: joao.id,
        ActivityAddresses: {
          create: {
            latitude: -23.5505,
            longitude: -46.6333, // São Paulo
          },
        },
      },
    }),

    // Yoga Avançado
    prisma.activities.create({
      data: {
        title: "Yoga Avançado",
        description: "Para praticantes experientes",
        typeId: yoga.id,
        confirmationCode: "YOGAADV",
        image: "advanced_yoga.jpg",
        scheduledDate: new Date("2025-04-15T18:00:00Z"),
        private: true,
        creatorId: ana.id,
        ActivityAddresses: {
          create: {
            latitude: -23.5505,
            longitude: -46.6333,
          },
        },
      },
    }),

    // Corrida de Rua
    prisma.activities.create({
      data: {
        title: "Corrida 10km",
        description: "Prova cronometrada",
        typeId: corrida.id,
        confirmationCode: "RUN10K",
        image: "race_event.jpg",
        scheduledDate: new Date("2025-04-20T07:30:00Z"),
        private: false,
        creatorId: maria.id,
        ActivityAddresses: {
          create: {
            latitude: -23.5505,
            longitude: -46.6333,
          },
        },
      },
    }),

    // Futebol Feminino
    prisma.activities.create({
      data: {
        title: "Futebol Feminino",
        description: "Treino aberto para mulheres",
        typeId: futebol.id,
        confirmationCode: "FTBWOM",
        image: "womens_soccer.jpg",
        scheduledDate: new Date("2025-04-09T16:00:00Z"),
        private: false,
        creatorId: ana.id,
        ActivityAddresses: {
          create: {
            latitude: -23.5505,
            longitude: -46.6333,
          },
        },
      },
    }),

    // Workshop de Node.js
    prisma.activities.create({
      data: {
        title: "Node.js para Iniciantes",
        description: "Introdução ao backend com JavaScript",
        typeId: workshop.id,
        confirmationCode: "NODEJS",
        image: "node_workshop.jpg",
        scheduledDate: new Date("2025-04-18T10:00:00Z"),
        private: true,
        creatorId: carlos.id,
        ActivityAddresses: {
          create: {
            latitude: -23.5505,
            longitude: -46.6333,
          },
        },
      },
    }),

    // Meditação em Grupo
    prisma.activities.create({
      data: {
        title: "Meditação Coletiva",
        description: "Prática em grupo no parque",
        typeId: meditacao.id,
        confirmationCode: "MEDITGRP",
        image: "group_meditation.jpg",
        scheduledDate: new Date("2025-04-22T07:00:00Z"),
        private: false,
        creatorId: joao.id,
        ActivityAddresses: {
          create: {
            latitude: -23.5505,
            longitude: -46.6333,
          },
        },
      },
    }),
  ]);

  // 6. Participantes nas atividades
  await prisma.activityParticipants.createMany({
    data: [
      // Yoga no Parque - Todos participando
      {
        activityId: activities[0].id,
        userId: maria.id,
        approved: true,
        confirmedAt: new Date(),
      },
      {
        activityId: activities[0].id,
        userId: carlos.id,
        approved: true,
        confirmedAt: new Date(),
      },
      {
        activityId: activities[0].id,
        userId: ana.id,
        approved: true,
        confirmedAt: new Date(),
      },

      // Corrida Noturna - Maria (criadora) + João e Ana
      {
        activityId: activities[1].id,
        userId: joao.id,
        approved: true,
        confirmedAt: new Date(),
      },
      {
        activityId: activities[1].id,
        userId: ana.id,
        approved: true,
        confirmedAt: new Date(),
      },

      // Pelada Semanal - Carlos (criador) + João e Maria
      {
        activityId: activities[2].id,
        userId: joao.id,
        approved: true,
        confirmedAt: new Date(),
      },
      {
        activityId: activities[2].id,
        userId: maria.id,
        approved: true,
        confirmedAt: new Date(),
      },

      // Oficina de React - Ana (criadora) + João (aprovado) e Maria (pendente)
      {
        activityId: activities[3].id,
        userId: joao.id,
        approved: true,
        confirmedAt: new Date(),
      },
      { activityId: activities[3].id, userId: maria.id, approved: false },

      // Meditação Guiada - João (criador) + Ana
      {
        activityId: activities[4].id,
        userId: ana.id,
        approved: true,
        confirmedAt: new Date(),
      },

      // Yoga Avançado - Ana (criadora) + Maria
      {
        activityId: activities[5].id,
        userId: maria.id,
        approved: true,
        confirmedAt: new Date(),
      },

      // Corrida 10km - Maria (criadora) + João e Carlos
      {
        activityId: activities[6].id,
        userId: joao.id,
        approved: true,
        confirmedAt: new Date(),
      },
      {
        activityId: activities[6].id,
        userId: carlos.id,
        approved: true,
        confirmedAt: new Date(),
      },

      // Futebol Feminino - Ana (criadora) + Maria
      {
        activityId: activities[7].id,
        userId: maria.id,
        approved: true,
        confirmedAt: new Date(),
      },

      // Workshop Node.js - Carlos (criador) + João (aprovado)
      {
        activityId: activities[8].id,
        userId: joao.id,
        approved: true,
        confirmedAt: new Date(),
      },

      // Meditação Coletiva - João (criador) + Maria e Ana
      {
        activityId: activities[9].id,
        userId: maria.id,
        approved: true,
        confirmedAt: new Date(),
      },
      {
        activityId: activities[9].id,
        userId: ana.id,
        approved: true,
        confirmedAt: new Date(),
      },
    ],
    skipDuplicates: true,
  });

  // 7. Conquistas dos usuários
  await prisma.userAchievements.createMany({
    data: [
      { userId: joao.id, achievementId: primeirosPassos.id },
      { userId: maria.id, achievementId: primeirosPassos.id },
      { userId: maria.id, achievementId: atleta.id },
      { userId: ana.id, achievementId: organizador.id },
      { userId: ana.id, achievementId: mestre.id },
    ],
    skipDuplicates: true,
  });

  // 8. Preferências dos usuários
  await prisma.preferences.createMany({
    data: [
      { userId: joao.id, typeId: yoga.id },
      { userId: joao.id, typeId: meditacao.id },
      { userId: maria.id, typeId: corrida.id },
      { userId: carlos.id, typeId: futebol.id },
      { userId: ana.id, typeId: workshop.id },
    ],
    skipDuplicates: true,
  });

  console.log("✅ Seed concluído com sucesso!");
  console.log("📊 Estatísticas:");
  console.table({
    Usuários: await prisma.users.count(),
    Atividades: await prisma.activities.count(),
    Participações: await prisma.activityParticipants.count(),
    Conquistas: await prisma.achievements.count(),
  });
}

main()
  .catch((e) => {
    console.error("❌ Erro no seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
