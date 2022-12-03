FROM openjdk:20-bullseye

ENV KOTLIN_VERSION 1.7.21

RUN apt-get update && \
    apt-get install -y curl unzip less && \
    curl -L "https://github.com/JetBrains/kotlin/releases/download/v${KOTLIN_VERSION}/kotlin-compiler-${KOTLIN_VERSION}.zip" \
         -o kotlin-compiler.zip && \
    unzip kotlin-compiler.zip && \
    cp -r kotlinc/* ./ && \
    rm -rf kotlinc kotlin-compiler.zip && \
    chmod +x /bin && \
    mkdir -p /workspace

WORKDIR /workspace

CMD [ "less" , "/var/log/dpkg.log" ]
