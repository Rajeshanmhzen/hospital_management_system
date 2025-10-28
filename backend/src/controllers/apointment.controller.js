import { getIO } from "../../config/socket.js";

export const createAppointment = async(req,res)=> {
    const appointment = await Appointment.create(req.body)

    const io = getIO()

    io.emit("newAppointment", {
        doctorId:appointment.doctorId,
        patientName:req.body.fullname,
        description:appointment.description
    })
    res.status(201).json({success:true, appointment})
}