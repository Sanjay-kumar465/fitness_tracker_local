import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import App from "../App";
import GoalForm from "../components/GoalForm";
import Dashboard from "../components/Dashboard";
import ActivityLog from "../components/ActivityLog";
import * as api from "../api";
import "@testing-library/jest-dom"
// Mock API responses
const mockEntries = [
  { id: 1, date: "2025-08-01", goalType: "Run", targetAmount: 5, achievedAmount: 3 },
  { id: 2, date: "2025-08-02", goalType: "Swim", targetAmount: 2, achievedAmount: 2 },
];

jest.spyOn(window, 'alert').mockImplementation(() => {});

describe("ReactAppTests", () => {
  test("React_BuildUIComponents_WhatisReactSPAsetupwithCreateReactApp", () => {
    render(<App />); // No MemoryRouter
    expect(screen.getByText(/Home/i)).toBeInTheDocument();
  });
  

  test("React_BuildUIComponents_FunctionalcomponentsJSXpropsconditionalrendering", () => {
    render(<Dashboard />, { wrapper: MemoryRouter });
    expect(screen.getByText(/Progress Dashboard/i)).toBeInTheDocument();
  });

  test("React_BuildUIComponents_useStateuseEffecteventhandlinglifecycleinhooks", async () => {
    jest.spyOn(api, "fetchEntries").mockResolvedValueOnce(mockEntries);
    render(<Dashboard />, { wrapper: MemoryRouter });
    await waitFor(() => {
      expect(screen.getByText(/Run - 3\/5/i)).toBeInTheDocument();
    });
  });

  test("React_BuildUIComponents_Controlledformsvalidationbasicsrenderinglistswithkeys", async () => {
    jest.spyOn(api, "saveEntry").mockResolvedValueOnce({});
    render(<GoalForm />);
    fireEvent.change(screen.getByPlaceholderText("Goal Type"), {
      target: { value: "Run", name: "goalType" },
    });
    fireEvent.change(screen.getByPlaceholderText("Target"), {
      target: { value: 10, name: "targetAmount" },
    });
    fireEvent.change(screen.getByPlaceholderText("Achieved"), {
      target: { value: 5, name: "achievedAmount" },
    });
    fireEvent.click(screen.getByText(/Add Goal/i));
    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith("Goal added!");
    });
  });

  

  test("React_APIIntegration_TestingAndAPIDocumentation_AxiosGETPOSTPUTDELETEtoSpringBootshowdatainform", async () => {
    jest.spyOn(api, "fetchEntries").mockResolvedValueOnce(mockEntries);
    render(<Dashboard />, { wrapper: MemoryRouter });
    await waitFor(() => {
      expect(screen.getByText(/Swim - 2\/2/i)).toBeInTheDocument();
    });
  });

  test("React_UITestingAndResponsivenessFixes_Dashboardrendersnodatawhenempty", async () => {
    jest.spyOn(api, "fetchEntries").mockResolvedValueOnce([]);
    render(<Dashboard />, { wrapper: MemoryRouter });
    await waitFor(() => {
      expect(screen.getByText(/No data yet/i)).toBeInTheDocument();
    });
  });

  test("React_APIIntegration_TestingAndAPIDocumentation_ActivityLogrendersentriesintable", async () => {
    jest.spyOn(api, "fetchEntries").mockResolvedValueOnce(mockEntries);
    render(<ActivityLog />, { wrapper: MemoryRouter });
    await waitFor(() => {
      expect(screen.getByText("Run")).toBeInTheDocument();
      expect(screen.getByText("Swim")).toBeInTheDocument();
    });
  });

  test("React_BuildUIComponents_GoalFormresetaftersubmit", async () => {
    jest.spyOn(api, "saveEntry").mockResolvedValueOnce({});
    render(<GoalForm />);
    fireEvent.change(screen.getByPlaceholderText("Goal Type"), {
      target: { value: "Swim", name: "goalType" },
    });
    fireEvent.change(screen.getByPlaceholderText("Target"), {
      target: { value: 5, name: "targetAmount" },
    });
    fireEvent.change(screen.getByPlaceholderText("Achieved"), {
      target: { value: 3, name: "achievedAmount" },
    });
    fireEvent.click(screen.getByText(/Add Goal/i));
    await waitFor(() => {
      expect(screen.getByPlaceholderText("Goal Type").value).toBe("");
    });
  });


  test("React_UITestingAndResponsivenessFixes_Handlesinvalidfetchresponsegracefully", async () => {
    jest.spyOn(api, "fetchEntries").mockResolvedValueOnce({});
    render(<Dashboard />, { wrapper: MemoryRouter });
    await waitFor(() => {
      expect(screen.getByText(/No data yet/i)).toBeInTheDocument();
    });
  });

  test("React_UITestingAndResponsivenessFixes_Handlesformsubmitwithoutdate", async () => {
    jest.spyOn(api, "saveEntry").mockResolvedValueOnce({});
    render(<GoalForm />);
    fireEvent.change(screen.getByPlaceholderText("Goal Type"), {
      target: { value: "Cycle", name: "goalType" },
    });
    fireEvent.change(screen.getByPlaceholderText("Target"), {
      target: { value: 4, name: "targetAmount" },
    });
    fireEvent.change(screen.getByPlaceholderText("Achieved"), {
      target: { value: 2, name: "achievedAmount" },
    });
    fireEvent.click(screen.getByText(/Add Goal/i));
    // date is required, so form should not submit
    expect(window.alert).not.toHaveBeenCalled();
  });
  
});
