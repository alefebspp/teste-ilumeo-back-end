import AppError from "@/errors/AppError";
import RecordRepository, {
  CreateRecordDTO,
} from "../repository/record.repository";

export default async function createRecord(
  recordRepository: RecordRepository,
  data: CreateRecordDTO
) {
  const todayRecords = await recordRepository.getTodayRecords({
    userId: data.userId,
    referenceDate: data.createdAt,
  });
  const typesToday = todayRecords.map((r) => r.type);

  const hasStart = typesToday.includes("start");
  const hasEnd = typesToday.includes("end");

  if (data.type === "start") {
    if (hasEnd) {
      throw new AppError(
        400,
        "Expediente já finalizado, não é possível iniciar novamente."
      );
    }

    if (hasStart && !hasEnd) {
      throw new AppError(
        400,
        "Você já iniciou o expediente e ainda não finalizou."
      );
    }
  }

  if (data.type === "end") {
    if (!hasStart) {
      throw new AppError(
        400,
        "Você precisa iniciar o expediente antes de finalizá-lo."
      );
    }
    if (hasEnd) {
      throw new AppError(400, "Você já finalizou o expediente hoje.");
    }
  }

  await recordRepository.create(data);
}
