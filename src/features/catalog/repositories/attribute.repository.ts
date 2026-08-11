import { prisma } from "../../../../lib/prisma";

export const attributeRepository = {
  findAll() {
    return prisma.attribute.findMany({
      include: { values: true },
      orderBy: { name: "asc" },
    });
  },
  findById(id: string) {
    return prisma.attribute.findUnique({
      where: { id },
      include: { values: true },
    });
  },
  createWithValues(data: {
    name: string;
    slug: string;
    values: { value: string; slug: string }[];
  }) {
    return prisma.attribute.create({
      data: {
        name: data.name,
        slug: data.slug,
        values: { create: data.values },
      },
      include: { values: true },
    });
  },
  updateName(id: string, name: string) {
    return prisma.attribute.update({
      where: { id },
      data: { name },
      include: { values: true },
    });
  },
  addValue(attributeId: string, value: string, slug: string) {
    return prisma.attributeValue.create({ data: { attributeId, value, slug } });
  },
  delete(id: string) {
    return prisma.attribute.delete({ where: { id } });
  },
};
