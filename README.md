
# Pharmacy Online Web App Portal

This project is full stack running web app for medical purposes, we have 2 main portals, Clinic and Pharmacy portals.

In this repo the pharmacy portal is mainly focused on simplifying the traditional pharmaceutical experience for the patient and the pharmacist. 

Pharmacy medicines are displayed for the patient like in an e-commerce website.


# Motivation

We worked on this project as our Advanced Computer Lab submission as we are Computer Science and Engineering students in the German University of Cairo.

# Build Status

The present build (spiderwebs 3.0) is the final build and our final submission, we worked on this project for 3 sprints.

Code architecture needs working on, we used typescript but rarely used any type definitions.

# Code Style

We've tried to follow a pretty standard code style for a Node JS and React TS web app.

# Screenshots

If you'd like to see screenshots and previews of our system please visit 

https://drive.google.com/drive/folders/1RElUs1EUiSDKRJqqgJ8rNsa5bvsFa5cN?usp=sharing


# Tech/Framework Used

Node JS
React TS
Express
MongoDB
Nodemon
Postman
Stripe
Antd
Material UI
Bootstrap

# Features

### Patient Portal:
#### Patient

        • View all medicines and their details
        • Add over the counter meds to the cart
        • Add perscribed medicines to cart
        • Chat with a pharmacist
        • View Wallet amount
        • View past and present orders

#### Pharmacist

        • View, archive/unarchive and update medicines
        • Add new medicines
        • chat with patient and doctor 
        • View Wallet amount

#### Admin

        • View all admins, patients, pharmacists
        • Add admins
        • Remove patients, pharmacists and other admins
        • View, Accept, Reject pharmacist registeration requests
        • View medicines

# Code Examples

here's an example of how we got our sockets to notify eachother

        const mongoose = require("mongoose");
        const Conversation = require("../Models/Conversation");
        const doctorModel = require("../Models/Doctor");
        const patientModel = require("../Models/Patient");
        const {
        getActiveConnections,
        connectedUsers,
        getKeyByValue,
        } = require("../socket/connectedUsers");
        const { getServerSocketInstance } = require("../socket/connectedUsers");

        const updateChatHistory = async (conversationId, toSpecificSocketId = null) => {
        console.log("entered update chat history");

        const conversation = await Conversation.findById(conversationId).populate({
        path: "messages",
        model: "Message",
        populate: {
        path: "author",
        select: "Username _id Name",
        },
        });
        console.log("In Update Chat History: " + conversation);

        if (!conversation) {
        return;
        }

        const io = getServerSocketInstance();

        if (toSpecificSocketId) {
        return io.to(toSpecificSocketId).emit("direct-chat-history", {
        messages: conversation.messages,
        participants: conversation.participants,
        });
        }

        conversation.participants.forEach((participantId) => {
        const activeConnections = getActiveConnections(participantId.toString());

        activeConnections.forEach((socketId) => {
        io.to(socketId).emit("direct-chat-history", {
                messages: conversation.messages,
                participants: conversation.participants,
        });
        });
        });
        };

        const sendNewDirectMessage = async (conversationId, newMessage, mySocketId) => {
        let messageAuthor = null;
        let role = "Doctor";

        const conversation = await Conversation.findById(conversationId);
        messageAuthor = await doctorModel.findById(newMessage.author);
        if (messageAuthor == null) {
        messageAuthor = await patientModel.findById(newMessage.author);
        role = "Patient";
        }

        if (!messageAuthor || !conversation) {
        return;
        }

        const message = {
        __v: newMessage.__v,
        _id: newMessage._id,
        content: newMessage.content,
        createdAt: newMessage.createdAt,
        updatedAt: newMessage.updatedAt,
        type: newMessage.type,
        author: {
        _id: messageAuthor._id,
        Username: messageAuthor.Username,
        Name: messageAuthor.Name, //TODO:
        },
        authorType: role,
        };

        const io = getServerSocketInstance();

        conversation.participants.forEach((participantId) => {
        const activeConnections = getActiveConnections(participantId.toString());

        console.log(
        activeConnections.filter((socketId) => {
                socketId != mySocketId;
        })
        );
        activeConnections.forEach((value, key) => {
        console.log("my id", mySocketId);
        console.log(getKeyByValue(mySocketId));
        console.log(` New connection: ${key}: ${value.userId}`);
        });
        activeConnections.forEach((socketId) => {
        if (!mySocketId.includes(socketId)) {
                io.to(socketId).emit("direct-message", {
                newMessage: message,
                participants: conversation.participants,
                from: connectedUsers.get(mySocketId),
                });
        }
        });
        });
        };

        module.exports = {
        updateChatHistory,
        sendNewDirectMessage,
        };

# Installation

You must install Node JS and React to be able to run this app.

Additionally write the following commands in the terminal to install dependancies

            npm i --legacy -peer -dependancies
            npm i
            npm i cors

# API Refrences

## Login Endpoints

### 1. Login
- **URL:** `/login`
- **Method:** `POST`
- **Example Request Body:**
  ```json
  {
    "username": "example_user",
    "password": "example_password"
  }

### 2. Forgot password
- **URL:** `/forgotPassword`
- **Method:** `POST`
- **Example Request Body:**
  ```json
 {
  "message": "Password reset email sent successfully"
}


### 3. Verify OTP
- **URL:** `/verifyOTP`
- **Method:** `POST`
- **Example Request Body:**
  ```json
 {
  "email": "example@example.com",
  "otp": "123456"
}

## Admin Endpoints

### 4. Get All Admins
- **Endpoint:** `/admin/allAdmins`
- **Method:** GET

### 5. Get All Patients
- **Endpoint:** `/admin/allPatients`
- **Method:** GET

### 6. Get All Pharmacists
- **Endpoint:** `/admin/allPharmacists`
- **Method:** GET

### 7. Remove Pharmacist
- **Endpoint:** `/admin/removePharmacist/:id`
- **Method:** DELETE

### 8. Remove Patient
- **Endpoint:** `/admin/removePatient/:id`
- **Method:** DELETE

### 9. Registration Requests
- **Endpoint:** `/admin/registrationRequests`
- **Method:** GET

### 10. Registration Request Details
- **Endpoint:** `/admin/registrationRequestDetails/:id`
- **Method:** GET

### 11. Get Patient
- **Endpoint:** `/admin/getPatient/:id`
- **Method:** GET

### 12. Get Pharmacist
- **Endpoint:** `/admin/getPharmacist/:id`
- **Method:** GET

### 13. Accept Pharmacist Request
- **Endpoint:** `/admin/acceptPharmacist/:id`
- **Method:** POST

### 14. Reject Pharmacist Request
- **Endpoint:** `/admin/rejectPharmacist/:id`
- **Method:** DELETE

## Pharmacist Endpoints

### 15. Get Pharmacist Info
- **Endpoint:** `/pharmacist/me`
- **Method:** GET

### 16. Add Pharmacist
- **Endpoint:** `/pharmacist/addPharmacist`
- **Method:** POST
- **Example Request Body:**
  ```json
  {
    "username": "new_pharmacist",
    "password": "pharmacist_password"
  }

### 17. Register Pharmacist
- **Endpoint:** `/pharmacist/register`
- **Method:** POST
- **Example Request Body:**
  ```json
  {
  "username": "new_pharmacist",
  "password": "pharmacist_password",
  "email": "pharmacist@example.com"
}
### 18. Change Password (Pharamcist)
- **Endpoint:** `/pharmacist/changePassword`
- **Method:** PUT
- **Example Request Body:**
  ```json
  {
        "password": "new_password"
}

## Pharmacist Endpoints

### 18. Add Medicine
- **Endpoint:** `/pharmacist/addMedicine`
- **Method:** POST

### 19. Update Medicine
- **Endpoint:** `/pharmacist/updateMedicine/:id`
- **Method:** PUT

### 20. Medicine Quantity Sales
- **Endpoint:** `/pharmacist/getMedicineQuantitySales/:id`
- **Method:** GET

### 21. Pharmacist Registration Request Details
- **Endpoint:** `/pharmacist/registrationRequestDetails/:id`
- **Method:** GET

### 22. Get Documents
- **Endpoint:** `/pharmacist/getDocuments`
- **Method:** GET

### 23. Upload Documents
- **Endpoint:** `/pharmacist/uploadDocuments`
- **Method:** POST

### 24. Upload Image
- **Endpoint:** `/pharmacist/uploadImage`
- **Method:** POST

### 25. Upload Personal ID
- **Endpoint:** `/pharmacist/uploadPersonalID/:id`
- **Method:** POST

### 26. Upload Pharmacy Degree
- **Endpoint:** `/pharmacist/uploadDegree/:id`
- **Method:** POST

### 27. Upload Licenses
- **Endpoint:** `/pharmacist/uploadLicenses/:id`
- **Method:** POST

### 28. View Pharma Wallet
- **Endpoint:** `/pharmacist/wallet`
- **Method:** GET

### 29. Archive Medicine
- **Endpoint:** `/pharmacist/archiveMed/:id`
- **Method:** PUT

### 30. Unarchive Medicine
- **Endpoint:** `/pharmacist/unarchiveMed/:id`
- **Method:** PUT

### 31. Get All Doctors
- **Endpoint:** `/pharmacist/allDoctors/`
- **Method:** GET

### 32. View All Notifications
- **Endpoint:** `/pharmacist/notifications`
- **Method:** GET

### 33. Get Unread Notifications
- **Endpoint:** `/pharmacist/unreadNotifications`
- **Method:** GET

### 34. Open Notification
- **Endpoint:** `/pharmacist/openNotification/:id`
- **Method:** PUT

## Patient Endpoints

### 35. Get Patient Info
- **Endpoint:** `/patient/me`
- **Method:** GET

### 36. Register Patient
- **Endpoint:** `/patient/register`
- **Method:** POST
- **Example Request Body:**
  ```json
  {
    "username": "new_patient",
    "password": "patient_password"
  }
## Patient Endpoints

### 37. View All Orders
- **Endpoint:** `/patient/orders`
- **Method:** GET

### 38. Remove All Orders
- **Endpoint:** `/patient/removeOrders`
- **Method:** GET

### 39. View Patient Order
- **Endpoint:** `/patient/viewOrder/:id`
- **Method:** GET

### 40. View Shipping Addresses
- **Endpoint:** `/patient/shippingAddresses`
- **Method:** GET

### 41. Add Shipping Address
- **Endpoint:** `/patient/shippingAddress`
- **Method:** PUT

### 42. View Wallet
- **Endpoint:** `/patient/wallet`
- **Method:** GET

### 43. Change Password (Patient)
- **Endpoint:** `/patient/changePassword`
- **Method:** PUT

### 44. Cancel Order
- **Endpoint:** `/patient/cancelOrder/:id`
- **Method:** PUT

### 45. Get All Pharmacists
- **Endpoint:** `/patient/allPharmacists/`
- **Method:** GET

## Medicine Endpoints

### 46. View Medicines
- **Endpoint:** `/medicine/viewMedicines`
- **Method:** GET

### 47. Check If Prescribed
- **Endpoint:** `/medicine/checkIfPrescribed/:id`
- **Method:** GET

### 48. View Medicine Details
- **Endpoint:** `/medicine/viewMedicineDetails/:id`
- **Method:** GET

### 49. View Active Medicines
- **Endpoint:** `/medicine/viewActiveMedicines`
- **Method:** GET

### 50. Search For Medicine
- **Endpoint:** `/medicine/searchForMedicine`
- **Method:** GET

### 51. Filter Medicine By Medicinal Use
- **Endpoint:** `/medicine/filterMedicineByMedicinalUse`
- **Method:** POST

### 52. View Alternatives
- **Endpoint:** `/medicine/viewAlternatives/:medicineId`
- **Method:** GET

## Cart Endpoints

### 53. Create Cart
- **Endpoint:** `/cart/createCart`
- **Method:** POST

### 54. Add Medicine To Cart
- **Endpoint:** `/cart/medicines/:medicineId`
- **Method:** POST

### 55. Update Medicine Quantity
- **Endpoint:** `/cart/medicines/:medicineId`
- **Method:** PUT

### 56. Remove Medicine
- **Endpoint:** `/cart/medicines/:medicineId`
- **Method:** DELETE

### 57. View Cart
- **Endpoint:** `/cart/:cartId`
- **Method:** GET

### 58. View Medicine Details In Cart
- **Endpoint:** `/cart/medicines/:medicineId`
- **Method:** GET

### 59. View Patient Cart
- **Endpoint:** `/cart/viewCart/:id`
- **Method:** GET

### 60. Get Cart Total
- **Endpoint:** `/cart/getCartTotal/:cartId`
- **Method:** GET

### 61. Pay Cart With Stripe
- **Endpoint:** `/cart/payWithStripe/`
- **Method:** POST

### 62. Pay Cart With Wallet
- **Endpoint:** `/cart/payWithWallet`
- **Method:** POST

### 63. Empty Cart
- **Endpoint:** `/cart/emptyCart`
- **Method:** PUT

### 64. Place Order
- **Endpoint:** `/cart/placeOrder`
- **Method:** POST

### 65. Send Notification
- **Endpoint:** `/cart/notify`
- **Method:** POST

## Additional Endpoints

### 66. Delete Files
- **Endpoint:** `/deleteFiles`
- **Method:** DELETE

### 67. Delete Notifications
- **Endpoint:** `/notifs/delete`
- **Method:** DELETE


# Tests

We've used postman to test the functionality throughout the project.

# How to Use


Upon running the web app you're greeted with our landing page, head over to the top right corner where there's the pharmacy portal button, when you click it you're taken to the login page, you can login as a patient, pharmacist or an admin. No account? then use the sign up feature to sign up as either a patient or pharmacist.

First off lets talk about the patient experience.

After you log in you'll land on your account info where you can view your account info and change your password.

To the side you'll see a side bar, in the next tab, which is the medicines tab, this is where you can browse the available medicines, view details of each medicine and add to cart. If a medicine is out of stock, you'll see a view alternatives button which displays alternative medicines depending on their active ingredients.

Next tab is your cart tab, where you can view your cart, update medicine quantities in your cart and checkout, after you checkout you'll be taken to order confirmation page where you can change the delivery address and choose youre payment type of COD, Credit card or wallet. Checkout! and then you'll be taken to the orders tab where you'll see all your pending orders, past orders, cancelled orders. 

In the orders tab you can choose to cancel an order if it is not yet shipped and you can view details of each order.


Now we'll be taking a look at the pharmacist experience.

To sign up as a pharmacist you'll have to register and then get accepted by an admin to be able to login.

After logging in you'll be greeted with your account info page where you can change your password or upload documents.

On the sidebar to the left, the next tab is the medicines tab. Here you can view all the medicines and update each medicine's details. You can choose to archive or unarchive medicines. 

As a pharmacist you can chat with a doctor to discuss any needed details, and patients can contact you also through the chat.

Pharmacists get to check their wallet amount where they get their monthly income.

# Contribute

We would love to hear feedback and/or any comments you have about the project style, code or structure.
Feel free to reach out at:

        marwan.moustafa@student.guc.edu.eg
        zeina.hezzah@student.guc.edu.eg
        hassan.aly@student.guc.edu.eg
        mohamed.mahran220@gmail.com
        ahmed.ibrahim@student.guc.edu.eg

# Credits

Spiderwebs team of contributors:

    Hassan Wael                    https://github.com/HassanOkashaa
    Zeina Hezzah                   http://github.com/zeinahezzah
    Ahmed Haytham                  https://github.com/AHIH
    Marwan Tarek                   https://github.com/marwantam
    Mohamed Mahran                 https://github.com/xmahran

Links and Resources:

        https://www.youtube.com/channel/UC29ju8bIPH5as8OGnQzwJyA
        https://www.youtube.com/channel/UCW5YeuERMmlnqo4oq8vwUpg
        https://www.youtube.com/playlist?list=PLZlA0Gpn_vH_uZs4vJMIhcinABSTUH2bY
        https://www.youtube.com/playlist?list=PLZlA0Gpn_vH_NT5zPVp18nGe_W9LqBDQK
        https://www.youtube.com/watch?v=mbsmsi7l3r4
        https://youtu.be/1r-F3FIONl8
        https://dev.to/salarc123/mern-stack-authentication-tutorial-part-1-the-backend-1c57
        https://ant.design/
        https://mui.com/material-ui/
        https://www.npmjs.com/


# License

Spiderwebs is the name we came up for our group, we do not intend on using the name of the group or this app commercially. This project is purely for educational purposes. 

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

