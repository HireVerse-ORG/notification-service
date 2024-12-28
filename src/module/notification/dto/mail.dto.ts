export interface SendEmailDto {
    to: string;  
    subject: string;    
    text: string;
    html?: string;
    save?: boolean;   
}

export interface SendEmailResponseDto {
    status: "SENT" | "FAILED";    
    message: string;    
    notificationId?: string; 
}

