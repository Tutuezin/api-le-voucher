import { jest } from "@jest/globals";
import voucherService from "services/voucherService";
import voucherRepository from "repositories/voucherRepository";

describe("Create voucher test suite", () => {
  it("should be able to create a voucher succesfully", async () => {
    const voucher = {
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
});
