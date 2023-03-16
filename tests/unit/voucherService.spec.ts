import { jest } from "@jest/globals";
import voucherService from "services/voucherService";
import voucherRepository from "repositories/voucherRepository";
import { conflictError } from "utils/errorUtils";

describe("create voucher test suite", () => {
  it("should be able to create a voucher succesfully", async () => {
    const voucher = {
      id: 1,
      code: "sup3r1d0l",
      discount: 30,
      used: false,
    };

    jest
      .spyOn(voucherRepository, "getVoucherByCode")
      .mockImplementationOnce((): any => {
        return undefined;
      });

    jest
      .spyOn(voucherRepository, "createVoucher")
      .mockImplementationOnce((): any => {});

    await voucherService.createVoucher(voucher.code, voucher.discount);

    expect(Promise.resolve);
  });

  it("should not be able to create a voucher that already exists", () => {
    expect(async () => {
      const voucher = {
        id: 1,
        code: "sup3r1d0l",
        discount: 30,
        used: false,
      };

      jest
        .spyOn(voucherRepository, "getVoucherByCode")
        .mockImplementationOnce((): any => {
          return voucher;
        });

      await voucherService.createVoucher(voucher.code, voucher.discount);
    }).rejects.toMatchObject(conflictError("Voucher already exist."));
  });
});
