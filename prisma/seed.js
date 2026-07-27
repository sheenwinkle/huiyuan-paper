const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const categories = [
  {
    name: "抽泡纸",
    slug: "chou-pao-zhi",
    description: "主打产品，适合批发、零售渠道和长期稳定供货。",
    sortOrder: 1
  },
  {
    name: "黄纸/烧纸",
    slug: "huang-zhi-shao-zhi",
    description: "传统祭祀场景常用品类，可按客户需求匹配规格。",
    sortOrder: 2
  },
  {
    name: "元宝纸",
    slug: "yuan-bao-zhi",
    description: "覆盖常规流通规格，适合区域批发和门店补货。",
    sortOrder: 3
  },
  {
    name: "锡箔纸",
    slug: "xi-bo-zhi",
    description: "面向祭祀用品渠道，支持多品类组合采购。",
    sortOrder: 4
  },
  {
    name: "纸扎",
    slug: "zhi-zha",
    description: "配合传统祭祀用品需求，后续可扩展定制展示。",
    sortOrder: 5
  },
  {
    name: "竹浆纸",
    slug: "zhu-jiang-zhi",
    description: "原料来源灵活，适合对纸质有要求的客户沟通。",
    sortOrder: 6
  },
  {
    name: "板纸",
    slug: "ban-zhi",
    description: "可作为加工配套品类，服务更完整的采购需求。",
    sortOrder: 7
  },
  {
    name: "定制加工",
    slug: "custom-processing",
    description: "支持批量加工、规格沟通和长期渠道合作。",
    sortOrder: 8
  }
];

async function main() {
  for (const category of categories) {
    await prisma.productCategory.upsert({
      where: { slug: category.slug },
      update: {
        name: category.name,
        description: category.description,
        sortOrder: category.sortOrder
      },
      create: category
    });
  }

  await prisma.knowledgeDocument.upsert({
    where: { id: "seed-huiyuan-basic-service" },
    update: {
      title: "慧缘纸制品基础客服口径",
      content:
        "慧缘纸制品位于江苏镇江丹阳市丹北镇埤城镇，主营抽泡纸，也覆盖黄纸/烧纸、元宝纸、锡箔纸、纸扎、竹浆纸、板纸和定制加工。服务范围以长三角批发商和零售商为主。涉及价格、规格、发货、账期和库存时，客服应引导客户留下微信或手机号，由人工确认。",
      isActive: true
    },
    create: {
      id: "seed-huiyuan-basic-service",
      title: "慧缘纸制品基础客服口径",
      content:
        "慧缘纸制品位于江苏镇江丹阳市丹北镇埤城镇，主营抽泡纸，也覆盖黄纸/烧纸、元宝纸、锡箔纸、纸扎、竹浆纸、板纸和定制加工。服务范围以长三角批发商和零售商为主。涉及价格、规格、发货、账期和库存时，客服应引导客户留下微信或手机号，由人工确认。",
      isActive: true
    }
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
