import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Address, AddressSchema } from "./entities/addresses.entity";
import { AddressesController } from "./addresses.controller";
import { AddressesService } from "./addresses.service";
import { UsersModule } from "src/users/users.module";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Address.name, schema: AddressSchema }
    ]),
    UsersModule
  ],
  controllers: [AddressesController],
  providers: [AddressesService]
})
export class AddressesModule { }