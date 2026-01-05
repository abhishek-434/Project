from django import forms
from .models import AdmissionInquiry, ContactMessage


# ==================== Admission Inquiry Form ====================
class AdmissionInquiryForm(forms.ModelForm):
    """
    Form for prospective students to submit admission inquiries
    Used on the Admissions page
    """
    
    class Meta:
        model = AdmissionInquiry
        fields = [
            'full_name', 
            'email', 
            'phone', 
            'course_interested', 
            'qualification', 
            'message'
        ]
        
        # Custom widgets for styling with Bootstrap classes
        widgets = {
            'full_name': forms.TextInput(attrs={
                'class': 'form-control',
                'placeholder': 'Enter your full name',
                'required': True
            }),
            'email': forms.EmailInput(attrs={
                'class': 'form-control',
                'placeholder': 'your.email@example.com',
                'required': True
            }),
            'phone': forms.TextInput(attrs={
                'class': 'form-control',
                'placeholder': '+91 1234567890',
                'required': True,
                'pattern': '[0-9+\s\-()]+',
                'title': 'Please enter a valid phone number'
            }),
            'course_interested': forms.Select(attrs={
                'class': 'form-select',
                'required': True
            }),
            'qualification': forms.TextInput(attrs={
                'class': 'form-control',
                'placeholder': 'e.g., 12th Pass, B.Sc., Graduate',
                'required': True
            }),
            'message': forms.Textarea(attrs={
                'class': 'form-control',
                'rows': 4,
                'placeholder': 'Any additional information or questions you have...'
            }),
        }
        
        # Custom labels for form fields
        labels = {
            'full_name': 'Full Name',
            'email': 'Email Address',
            'phone': 'Phone Number',
            'course_interested': 'Course/Department Interested',
            'qualification': 'Current Qualification',
            'message': 'Additional Message (Optional)',
        }
        
        # Help text for fields
        help_texts = {
            'phone': 'Include country code if calling from outside India',
            'qualification': 'Your highest completed qualification',
            'message': 'Tell us about your goals and any specific questions',
        }
    
    def clean_phone(self):
        """
        Validate phone number
        Ensures phone has at least 10 digits
        """
        phone = self.cleaned_data.get('phone')
        
        # Remove non-digit characters for validation
        digits = ''.join(filter(str.isdigit, phone))
        
        if len(digits) < 10:
            raise forms.ValidationError('Phone number must have at least 10 digits.')
        
        return phone
    
    def clean_email(self):
        """
        Validate email format
        Convert to lowercase for consistency
        """
        email = self.cleaned_data.get('email')
        return email.lower()


# ==================== Contact Message Form ====================
class ContactMessageForm(forms.ModelForm):
    """
    Form for visitors to send messages through the Contact page
    """
    
    class Meta:
        model = ContactMessage
        fields = [
            'name', 
            'email', 
            'phone', 
            'subject', 
            'message'
        ]
        
        # Custom widgets for styling with Bootstrap classes
        widgets = {
            'name': forms.TextInput(attrs={
                'class': 'form-control',
                'placeholder': 'Your Name',
                'required': True
            }),
            'email': forms.EmailInput(attrs={
                'class': 'form-control',
                'placeholder': 'your.email@example.com',
                'required': True
            }),
            'phone': forms.TextInput(attrs={
                'class': 'form-control',
                'placeholder': '+91 1234567890 (Optional)',
                'pattern': '[0-9+\s\-()]*',
                'title': 'Please enter a valid phone number'
            }),
            'subject': forms.TextInput(attrs={
                'class': 'form-control',
                'placeholder': 'Subject of your message',
                'required': True,
                'maxlength': '200'
            }),
            'message': forms.Textarea(attrs={
                'class': 'form-control',
                'rows': 5,
                'placeholder': 'Write your message here...',
                'required': True
            }),
        }
        
        # Custom labels for form fields
        labels = {
            'name': 'Your Name',
            'email': 'Email Address',
            'phone': 'Phone Number (Optional)',
            'subject': 'Subject',
            'message': 'Your Message',
        }
        
        # Help text for fields
        help_texts = {
            'subject': 'Brief description of your inquiry',
            'message': 'Please provide details about your question or feedback',
        }
    
    def clean_email(self):
        """
        Validate and normalize email
        """
        email = self.cleaned_data.get('email')
        return email.lower()
    
    def clean_message(self):
        """
        Validate message length
        Ensure message is not too short
        """
        message = self.cleaned_data.get('message')
        
        if len(message.strip()) < 10:
            raise forms.ValidationError('Message must be at least 10 characters long.')
        
        return message
    
    def clean_subject(self):
        """
        Validate subject is not empty
        """
        subject = self.cleaned_data.get('subject')
        
        if len(subject.strip()) < 5:
            raise forms.ValidationError('Subject must be at least 5 characters long.')
        
        return subject