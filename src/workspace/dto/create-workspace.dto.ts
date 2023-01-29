import { ApiProperty, OmitType } from "@nestjs/swagger";
import { IsOptional } from "class-validator";
import { MemoryStoredFile } from "nestjs-form-data";
import { HasMimeType, IsFile } from "nestjs-form-data/dist/decorators";
import { WorkspaceModel } from "./workspace-model";

export class CreateWorkspaceDto extends OmitType(WorkspaceModel, [
  "id",
  "ownerId",
  "cover",
]) {
  @ApiProperty({ type: "string", required: false, format: 'binary' })
  @IsOptional()
  @IsFile()
  @HasMimeType(["image/jpeg", "image/png"])
  readonly cover?: MemoryStoredFile;
}
