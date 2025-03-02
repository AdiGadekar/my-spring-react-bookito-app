window.labelConfig = {
  ...window.labelConfig,

  bookingHistory: {
    title: "Booking History",
    searchPlaceholder: "Search by name's, location's or booking date",
    filters: {
      status: {
        all: "All Statuses",
        completed: "Completed",
        cancelled: "Cancelled",
      },
      paymentStatus: {
        all: "All Payment Status",
        completed: "Completed",
        pending: "Pending",
        cancelled: "Cancelled",
      },
    },
    tableHeaders: {
      bookingId: "Booking ID",
      customerName: "Customer Name",
      driverName: "Driver Name",
      pickupLocation: "Pickup Location",
      taxiNumberPlate: "Taxi Number",
      dropoffLocation: "Dropoff Location",
      status: "Status",
      bookingDate: "Booking Date",
      amount: "Amount",
      paymentMethod: "Payment Method",
      paymentStatus: "Payment Status",
    },
  },

  addDriver: {
    title: "Driver Registration",
    firstName: "First Name",
    lastName: "Last Name",
    email: "Email",
    phoneNumber: "Phone Number",
    password: "Password",
    licenseNumber: "License Number",
    registerButton: "Register Driver",
    clearButton: "Clear Form",
    successMessage: "Driver Registration Successful!",
    errorMessage: "Registration Failed!!!",
    invalidEmail: 'Please provide a valid email address from "@gmail.com"',
    invalidPassword:
      "Password must be at least 6 characters long, include an uppercase letter, a number, and a special character",
    invalidPhone:
      "Phone number must be exactly 10 digits and contain only numbers",
    invalidLicense:
      "License number must be in the format: 3 letters followed by 4 digits",
    invalidName:
      "First Name and Last Name must contain only alphabets and be at least 2 characters long",
  },

  addTaxi: {
    title: "Taxi Registration",
    numberPlate: "Number Plate",
    model: "Model",
    color: "Color",
    pricePerKm: "Price Per Km",
    registerButton: "Register Taxi",
    clearButton: "Clear Form",
    successMessage: "Taxi Registration Successful!",
    errorMessage: "Registration Failed!",
    invalidNumberPlate: "License plate must be in the format: 'XX 99 XX 9999'",
    invalidModel:
      "Model name is required and must be at least 2 characters long",
    invalidColor: "Color is required and must be a valid text input",
    invalidPrice: "Price per km must be a positive number between 10 and 100",
  },

  allCustomers: {
    title: "Customers",
    searchPlaceholder: "Search by name, email or date",
    filterByYear: "Filter by Year",
    years: {
      all: "All Years",
      twentyFive: "2025",
      twentyFour: "2024",
      twentyThree: "2023",
    },
    tableHeaders: {
      customerName: "Customer Name",
      email: "Email Address",
      phoneNumber: "Contact Number",
      createdAt: "Account Creation Date",
      actions: "Actions",
    },
    sort: {
      name: "Sort by Name",
      createdAt: "Sort by Account Creation Date",
    },
    pagination: {
      previous: "Previous",
      next: "Next",
      page: "Page",
      of: "of",
    },
    noDataMessage: {
      icon: "📭",
      text: "No Data Found",
    },
    deleteAction: {
      buttonLabel: "Delete",
      toastMessage: "Delete Functionality is disabled by Super Admin!!!",
    },
  },
};
