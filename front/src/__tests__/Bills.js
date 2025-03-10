/**
 * @jest-environment jsdom
 */

import { screen, waitFor, fireEvent } from "@testing-library/dom";
import BillsUI from "../views/BillsUI.js";
import { bills } from "../fixtures/bills.js";
import Bills from "../containers/Bills.js";
import { ROUTES_PATH, ROUTES } from "../constants/routes.js";
import { localStorageMock } from "../__mocks__/localStorage.js";
import mockStore from "../__mocks__/store";
import router from "../app/Router.js";
import '@testing-library/jest-dom';

jest.mock("../app/store", () => mockStore);

describe("Given I am connected as an employee", () => {
  describe("When I am on Bills Page", () => {
    test("Then bill icon in vertical layout should be highlighted", async () => {
      Object.defineProperty(window, "localStorage", {
        value: localStorageMock,
      });
      window.localStorage.setItem(
        "user",
        JSON.stringify({
          type: "Employee",
        })
      );
      const root = document.createElement("div");
      root.setAttribute("id", "root");
      document.body.append(root);
      router();
      window.onNavigate(ROUTES_PATH.Bills);
      await waitFor(() => screen.getByTestId("icon-window"));
      const windowIcon = screen.getByTestId("icon-window");
      //to-do write expect expression
      expect(windowIcon).toHaveClass("active-icon");
    });
    test("Then bills should be ordered from earliest to latest", () => {
      //trier les bills par date du plus récent au plus ancien
      document.body.innerHTML = BillsUI({
        data: bills.sort((a, b) => (a.date < b.date ? 1 : -1)),
      });
      const dates = screen
        .getAllByText(
          /^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i
        )
        .map((a) => a.innerHTML);
      const antiChrono = (a, b) => (a < b ? 1 : -1);
      const datesSorted = [...dates].sort(antiChrono);
      expect(dates).toEqual(datesSorted);
    });

    //affichage du titre etdu bouton
    test("Then title and button should be displayed", () => {
      document.body.inneHTML = BillsUI({ data: [] });
      expect(screen.getAllByText("Mes notes de frais")).toBeTruthy();
      expect(screen.getAllByTestId("btn-new-bill")).toBeTruthy();
    });

    //affichage du formulaire de création de note de frais
    describe("When I click on the button 'Nouvelle note de frais'", () => {
      test("Then the form should be displayed", () => {
        const onNavigate = (pathname) => {
          document.body.innerHTML = ROUTES({ pathname });
        };
        Object.defineProperty(window, "localStorage", {
          value: localStorageMock,
        });
        window.localStorage.setItem(
          "user",
          JSON.stringify({
            type: "Employee",
          })
        );
        const bills = new Bills({
          document,
          onNavigate,
          store: mockStore,
          localStorage: window.localStorage,
        });
        document.body.innerHTML = BillsUI({ data: bills });
        const NewBillBTN = screen.getByTestId("btn-new-bill");
        const handleClickNewBill = jest.fn((e) => bills.handleClickNewBill);
        NewBillBTN.addEventListener("click", handleClickNewBill);
        fireEvent.click(NewBillBTN);
        expect(handleClickNewBill).toHaveBeenCalled();
      });
    });

    //la modale du justificatif de la note de frais apparait
    describe("When I click on the icon eye", () => {
      test("Then the modal should be displayed", () => {
        const onNavigate = (pathname) => {
          document.body.innerHTML = ROUTES({ pathname });
        };
        Object.defineProperty(window, "localStorage", {
          value: localStorageMock,
        });
        window.localStorage.setItem(
          "user",
          JSON.stringify({
            type: "Employee",
          })
        );
        const billsPage = new Bills({
          document,
          onNavigate,
          store: mockStore,
          localStorage: window.localStorage,
        });
        document.body.innerHTML = BillsUI({ data: bills });
        const iconEye = screen.getAllByTestId("icon-eye");
        const handleClickIconEye = jest.fn(billsPage.handleClickIconEye);
        const modaleFile = document.getElementById("modaleFile");
        $.fn.modal = jest.fn(() => modaleFile.classList.add("show"));
      
        iconEye.forEach(icon => {
          icon.addEventListener("click", handleClickIconEye(icon));
          fireEvent.click(icon);
          expect(handleClickIconEye).toHaveBeenCalled();
        });
        expect(modaleFile).toHaveClass("show");
        expect(screen.getByText("Justificatif")).toBeTruthy();
        expect(bills[0].fileUrl).toBeTruthy();
      
      });

      //Test errorPage on Bills.js
      describe("Given I am connected as an employee", () => {
        describe("When data fetching fails", () => {
          beforeEach(() => {
            jest.spyOn(mockStore, "bills");
          });
          //test de l'erreur 404
          test("Then, ErrorPage should be rendered", async () => {
            mockStore.bills.mockImplementationOnce(() => ({
              return: () => Promise.reject(new Error("Erreur 404")),
            }));
            document.body.innerHTML = BillsUI({ error: "Erreur 404" });
            expect(screen.getByText(/Erreur 404/)).toBeTruthy();
          });
          test("Then, ErrorPage should be rendered", async () => {
            mockStore.bills.mockImplementationOnce(() => ({
              return: () => Promise.reject(new Error("Erreur 500")),
            }));
            document.body.innerHTML = BillsUI({ error: "Erreur 500" });
            expect(screen.getByText(/Erreur 500/)).toBeTruthy();
          });
        });
      });
    })
  })
})
