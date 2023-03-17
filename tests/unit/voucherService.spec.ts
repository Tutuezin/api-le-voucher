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

describe("apply voucher test suite", () => {
  it("should be able to apply a voucher succesfully", async () => {
    const voucher = {
      id: 1,
      code: "sup3r1d0l",
      discount: 30,
      used: false,
    };

    const amount = 100;

    jest
      .spyOn(voucherRepository, "getVoucherByCode")
      .mockImplementationOnce((): any => {
        return voucher;
      });

    jest
      .spyOn(voucherRepository, "useVoucher")
      .mockImplementationOnce((): any => {
        return {
          id: 1,
          code: "sup3r1d0l",
          discount: 30,
          used: true,
        };
      });

    const finalOrder = await voucherService.applyVoucher(voucher.code, amount);

    expect(finalOrder.amount).toBe(amount);
    expect(finalOrder.discount).toBe(voucher.discount);
    expect(finalOrder.applied).toBe(true);
    expect(finalOrder.finalAmount).toBe(
      amount - amount * (voucher.discount / 100)
    );
  });

  it("should not be able to apply voucher apply the voucher that does not exist", () => {
    expect(async () => {
      const voucher = {
        id: 1,
        code: "sup3r1d0l",
        discount: 30,
        used: false,
      };

      const amount = 100;

      jest
        .spyOn(voucherRepository, "getVoucherByCode")
        .mockImplementationOnce((): any => {
          return undefined;
        });

      jest
        .spyOn(voucherRepository, "useVoucher")
        .mockImplementationOnce((): any => {});

      await voucherService.applyVoucher(voucher.code, amount);
    }).rejects.toMatchObject(conflictError("Voucher does not exist."));
  });

  it("should not be able to apply voucher that has already been used", async () => {
    const voucher = {
      id: 1,
      code: "sup3r1d0l",
      discount: 30,
      used: true,
    };

    const amount = 100;

    jest
      .spyOn(voucherRepository, "getVoucherByCode")
      .mockImplementationOnce((): any => {
        return voucher;
      });

    jest
      .spyOn(voucherRepository, "useVoucher")
      .mockImplementationOnce((): any => {});

    const finalOrder = await voucherService.applyVoucher(voucher.code, amount);

    expect(finalOrder.amount).toBe(amount);
    expect(finalOrder.discount).toBe(voucher.discount);
    expect(finalOrder.applied).toBe(false);
    expect(finalOrder.finalAmount).toBe(amount);
  });

  it("Should not apply voucher if amount is lower than 100", async () => {
    const voucher = {
      id: 1,
      code: "sup3r1d0l",
      discount: 30,
      used: false,
    };

    const amount = 90;

    jest
      .spyOn(voucherRepository, "getVoucherByCode")
      .mockImplementationOnce((): any => {
        return voucher;
      });

    jest
      .spyOn(voucherRepository, "useVoucher")
      .mockImplementationOnce((): any => {});

    const finalOrder = await voucherService.applyVoucher(voucher.code, amount);

    console.log(finalOrder);
    expect(finalOrder.amount).toBe(amount);
    expect(finalOrder.discount).toBe(voucher.discount);
    expect(finalOrder.applied).toBe(false);
    expect(finalOrder.finalAmount).toBe(amount);
  });
});
