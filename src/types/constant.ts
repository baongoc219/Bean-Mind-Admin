
export enum ROLE {
    Mentee = 1,
    Mentor = 2,
    Admin = 3,
}
export enum CERTIFICATE_STATUS {
    Pending = 1,
    Approved = 2,
    Denied = 3
}
export enum BADGE {
    Fresher = 1,
    Junior = 2,
    Senior = 3
}

export enum ORDER_STATUS {
    Draft = 1, //Mentor tạo khóa học nháp
    Pending = 2, //Mentor đã submit khóa học, chờ duyệt
    Waiting = 3, //Khóa học đã được duyệt chờ đủ mentee
    CancelNotEnough = 4, //Khóa học kết thúc do không đủ thành viên
    Start = 5,
    End = 6,
}