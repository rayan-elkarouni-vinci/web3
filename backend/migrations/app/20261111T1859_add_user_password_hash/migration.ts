#!/usr/bin/env -S node
import type { Contract as Start } from "../../snapshots/950b871e9eb2bb4cce825064035f9caec51b86ff47193e93be17ff06c1bdcda4/contract";
import startContract from "../../snapshots/950b871e9eb2bb4cce825064035f9caec51b86ff47193e93be17ff06c1bdcda4/contract.json" with { type: "json" };
import type { Contract as End } from "../../snapshots/ba5996bd661e3da29d1dfb09d38bdbad6713e5185f91bfabbe7c92c37752ab8f/contract";
import endContract from "../../snapshots/ba5996bd661e3da29d1dfb09d38bdbad6713e5185f91bfabbe7c92c37752ab8f/contract.json" with { type: "json" };
import {
  Migration,
  MigrationCLI,
  col,
  placeholder,
} from "@prisma/orm-postgres/migration";

import postgres from "@prisma/orm-postgres/runtime";
const { sql: db, contract } = postgres<End>({ contractJson: endContract });
const DEMO_PASSWORD_HASH =
  "$2b$10$HuSf2oYeJYKSx4B0EsppferLnd5nT5OP0u3lMgHVl5dq4iLufV6ZW";

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.addColumn({
        schema: "public",
        table: "User",
        column: col("passwordHash", "text", {
          codecRef: { codecId: "pg/text@1" },
        }),
      }),
      this.dataTransform(contract, "backfill-user-passwordHash", {
        // "quelles lignes ont encore besoin de travail ?"
        check: () =>
          db.public.User.select("id")
            .where((f, fns) => fns.eq(f.passwordHash, null))
            .limit(1),
        // remplir toutes les lignes encore vides
        run: () =>
          db.public.User.update({ passwordHash: DEMO_PASSWORD_HASH }).where(
            (f, fns) => fns.eq(f.passwordHash, null),
          ),
      }),
      this.setNotNull({
        schema: "public",
        table: "User",
        column: "passwordHash",
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
